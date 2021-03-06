import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ImageBackground,
  ScrollView,
  RefreshControl,
} from 'react-native';
import SafeWrapper from '../../../shared/components/safeWrapper';
import {Input} from 'react-native-elements';
import PropertyCard from '../../../shared/components/propertyCard';
import Header from '../../../shared/components/header';
import PropertyOption from './components/propertyOptions';
import * as Work from '../../../shared/exporter';
import BtnWrapper from '../../../shared/components/btnWrapper';
import SearchIcon from 'react-native-vector-icons/AntDesign';
import NotAvailable from '../../../shared/components/notAvailable';
import axios from 'axios';

const {WP} = Work;
const Properties = ({navigation}) => {
  const [isBuy, setIsBuy] = useState(true);
  const [homeData, setHomeData] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [searchData, setSearchData] = useState(null);
  const [city, setCity] = useState(null);

  useEffect(() => {
    getHomeData();
  }, [isBuy]);

  const onSearchHandler = async () => {
    const isConnected = Work.checkInternetConnection();
    if (isConnected) {
      setLoading(true);
      try {
        const response = await axios.post('property/searchproperty', {
          city,
        });
        if (response?.data?.data) {
          setCity(null);
          navigation.navigate('searchResult', {result: response?.data?.data});
        }
      } catch (error) {
        Work.showToast('Server Timeout');
      }
      setLoading(false);
    } else Work.showToast(Work.INTERNET_CONNECTION_ERROR);
  };

  const renderItem = ({item}) => (
    <View style={{marginVertical: WP('3'), alignSelf: 'center'}}>
      <PropertyCard
        onPress={() =>
          navigation.navigate('propertyDetail', {
            img: item?.img[0],
            price: item?.starting_bid,
            area: item?.area,
            bedroom: item?.bedroom,
            bathroom: item?.bathroom,
            city: item?.city,
            country: item?.country,
            isHot: item?.isHot,
            description: item?.description,
            id: item?._id,
          })
        }
        img={item?.img[0]}
        price={item?.starting_bid}
        area={item?.area}
        bedroom={item?.bedroom}
        bathroom={item?.bathroom}
        city={item?.city}
        country={item?.country}
        isHot={item?.isHot}
        description={item?.description}
      />
    </View>
  );

  const getHomeData = async () => {
    const isConnected = Work.checkInternetConnection();
    if (isConnected) {
      setLoading(true);
      try {
        const response = await axios.get(
          `property/home/${isBuy ? 'buy' : 'rent'}`,
        );
        if (response?.data?.data) setHomeData(response?.data?.data);
      } catch (error) {
        Work.showToast('Server Timeout');
      }
      setLoading(false);
    } else Work.showToast(Work.INTERNET_CONNECTION_ERROR);
  };
  return (
    <SafeWrapper>
      <ImageBackground
        style={{flex: 1}}
        source={require('../../../assets/bg.png')}>
        <ScrollView
          contentContainerStyle={{flexGrow: 1}}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={getHomeData} />
          }>
          <Header label="home" />
          <PropertyOption
            propertyType={isBuy}
            onPressBuy={() => setIsBuy(true)}
            onPressRent={() => setIsBuy(false)}
          />
          <Input
            placeholder="Search By City"
            containerStyle={styles.inputContainer}
            inputContainerStyle={{borderBottomWidth: 0}}
            inputStyle={{fontSize: WP('4')}}
            value={city}
            onChangeText={(text) => setCity(text)}
            rightIcon={
              <BtnWrapper press={onSearchHandler}>
                <SearchIcon
                  name="search1"
                  size={WP('5')}
                  color={Work.COLOR.grey}
                />
              </BtnWrapper>
            }
            onSubmitEditing={onSearchHandler}
          />
          {homeData?.length > 0 ? (
            <View style={{marginTop: WP('7')}}>
              <FlatList
                data={homeData}
                renderItem={renderItem}
                keyExtractor={(item) => item?._id}
                onRefresh={getHomeData}
                refreshing={isLoading}
              />
            </View>
          ) : (
            <View style={styles.notAvaiable}>
              <NotAvailable
                label="No Property Available"
                iconSize={WP('20')}
                labelSize={{fontSize: WP('6')}}
              />
            </View>
          )}
        </ScrollView>
      </ImageBackground>
    </SafeWrapper>
  );
};

export default Properties;

const styles = StyleSheet.create({
  headerContainer: {
    position: 'absolute',
    top: '3%',
    alignSelf: 'center',
  },
  inputContainer: {
    backgroundColor: Work.COLOR.white,
    height: WP('13'),
    width: '92%',
    alignSelf: 'center',
    borderRadius: 5,
    marginTop: WP('6'),
    elevation: 6,
  },
  notAvaiable: {
    width: '100%',
    height: '90%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
