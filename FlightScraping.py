import json
from collections import OrderedDict
import random
import datetime
import pymongo
from pymongo import MongoClient
import pprint

from time import sleep, strftime
from random import randint
import pandas as pd
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import smtplib
from email.mime.multipart import MIMEMultipart

def load_more():
    try:
        more_results = '//a[@class = "moreButton"]'
        driver.find_element_by_xpath(more_results).click()
        # Printing these notes during the program helps me quickly check what it is doing
        print('sleeping.....')
        sleep(randint(45,60))
    except:
        pass

def page_scrape():
    """This function takes care of the scraping part"""

    xp_dates = '//div[@class="section date"]'
    dates = driver.find_elements_by_xpath(xp_dates+"/div")
    dates_list = [value.text for value in dates]
    date_list = dates_list[::2]
    day_list = dates_list[1::2]
    a_day = [date_list[i] for i in range(0, len(date_list), 2)]
    a_weekday = [day_list[i] for i in range(0, len(day_list), 2)]
    b_day = [date_list[i] for i in range(1, len(date_list), 2)]
    b_weekday = [day_list[i] for i in range(1, len(day_list), 2)]

    # Separating the weekday from the day
    # a_day = [value.split()[0] for value in a_date_list]
    # a_weekday = [value.split()[1] for value in a_date_list]
    # b_day = [value.split()[0] for value in b_date_list]
    # b_weekday = [value.split()[1] for value in b_date_list]


    
    # getting the prices
    xp_prices = '//span[@class="price-text"]'
    prices = driver.find_elements_by_xpath(xp_prices)
    prices_list = [price.text.replace('$','') for price in prices if price.text != '']
    prices_list = list(map(int, prices_list))

    # the stops are a big list with one leg on the even index and second leg on odd index
    # xp_stops = '//div[@class="section stops"]/div[1]'
    # stops = driver.find_elements_by_xpath(xp_stops)
    # stops_list = [stop.text[0].replace('n','0') for stop in stops]
    # a_stop_list = stops_list[::2]
    # b_stop_list = stops_list[1::2]

    # xp_stops_cities = '//div[@class="section stops"]/div[2]'
    # stops_cities = driver.find_elements_by_xpath(xp_stops_cities)
    # stops_cities_list = [stop.text for stop in stops_cities]
    # a_stop_name_list = stops_cities_list[::2]
    # b_stop_name_list = stops_cities_list[1::2]
    
    # this part gets me the airline company and the departure and arrival times, for both legs
    xp_schedule = '//div[@class="section times"]'
    schedules = driver.find_elements_by_xpath(xp_schedule)
    hours_list = []
    carrier_list = []
    for schedule in schedules:
        hours_list.append(schedule.text.split('\n')[0])
        carrier_list.append(schedule.text.split('\n')[1])
    # split the hours and carriers, between a and b legs
    a_hours = hours_list[::2]
    a_carrier = carrier_list[::2]
    b_hours = hours_list[1::2]
    b_carrier = carrier_list[1::2]

    
    cols = (['Out Day', 'Out Time', 'Out Weekday', 'Out Airline', 'Return Day', 'Return Time', 'Return Weekday', 'Return Airline', 'Price'])

    flights_df = pd.DataFrame({'Out Day': a_day,
                               'Out Weekday': a_weekday,
                               'Return Day': b_day,
                               'Return Weekday': b_weekday,
                               'Out Time': a_hours,
                               'Out Airline': a_carrier,
                               'Return Time': b_hours,
                               'Return Airline': b_carrier,                           
                               'Price': prices_list})[cols]

                              #      'Out Stops': a_stop_list,
                               #'Out Stop Cities': a_stop_name_list,
                               #'Return Stops': b_stop_list,
                               #'Return Stop Cities': b_stop_name_list,
                                                              #'Return Duration': b_duration,
    
    flights_df['timestamp'] = strftime("%Y%m%d-%H%M") # so we can know when it was scraped
    return flights_df

def start_kayak(city_from, city_to, date_start, date_end):
    """City codes - it's the IATA codes!
    Date format -  YYYY-MM-DD"""
    
    kayak = ('https://www.kayak.com/flights/' + city_from + '-' + city_to +
             '/' + date_start + '-flexible/' + date_end + '-flexible?sort=bestflight_a')
    driver.get(kayak)
    sleep(randint(8,10))
    
    # sometimes a popup shows up, so we can use a try statement to check it and close
    try:
        xp_popup_close = '//button[contains(@id,"dialog-close") and contains(@class,"Button-No-Standard-Style close ")]'
        driver.find_elements_by_xpath(xp_popup_close)[5].click()
    except Exception as e:
        pass
    sleep(5)
    print('loading more.....')
    
#     load_more()
    
    print('starting first scrape.....')
    df_flights_best = page_scrape()
    df_flights_best['sort'] = 'best'
    sleep(randint(60,80))
    
    # Let's also get the lowest prices from the matrix on top
    matrix = driver.find_elements_by_xpath('//*[contains(@id,"FlexMatrixCell")]')
    matrix_prices = [price.text.replace('$','') for price in matrix]
    matrix_prices = list(map(int, matrix_prices))
    matrix_min = min(matrix_prices)
    matrix_avg = sum(matrix_prices)/len(matrix_prices)
    
    print('switching to cheapest results.....')
    cheap_results = '//a[@data-code = "price"]'
    driver.find_element_by_xpath(cheap_results).click()
    sleep(randint(60,90))
    print('loading more.....')
    
#     load_more()
    
    print('starting second scrape.....')
    df_flights_cheap = page_scrape()
    df_flights_cheap['sort'] = 'cheap'
    sleep(randint(60,80))
    
    print('switching to quickest results.....')
    quick_results = '//a[@data-code = "duration"]'
    driver.find_element_by_xpath(quick_results).click()  
    sleep(randint(60,90))
    print('loading more.....')
    
#     load_more()
    
    print('starting third scrape.....')
    df_flights_fast = page_scrape()
    df_flights_fast['sort'] = 'fast'
    sleep(randint(60,80))
    
    # saving a new dataframe as an excel file. the name is custom made to your cities and dates
    final_df = df_flights_cheap.append(df_flights_best).append(df_flights_fast)
    # final_df.to_excel('search_backups//{}_flights_{}-{}_from_{}_to_{}.xlsx'.format(strftime("%Y%m%d-%H%M"),
    #                                                                                city_from, city_to, 
    #                                                                                date_start, date_end), index=False)
    print('saved df.....')
    return final_df

def saveToDB(flight):
    client = MongoClient('localhost', 27017)
    db = client['flights']
    collection = db['flights']

    post_id = collection.insert_one(flight).inserted_id

def SaveAndParseToDB(data,destination,date):

    for x in range(0,len(data)):
        json_object = data[x]

        if(json_object['stops'] != "Nonstop"):
            continue

        cityID = MapCityToID(destination)
        takeoff_date_time_str = str(date) +" "+ json_object['timings'][0]['departure_time']
        landing_date_time_str = str(date) +" "+ json_object['timings'][0]['arrival_time']

        DBdata = {}
        DBdata['price'] = float(json_object['ticket price'])
        DBdata['destination'] = cityID
        DBdata['takeoff'] =  datetime.datetime.strptime(takeoff_date_time_str, '%d %m %Y %I:%M%p')
        DBdata['landing'] = datetime.datetime.strptime(landing_date_time_str, '%d %m %Y %I:%M%p')

        saveToDB(DBdata)



def MapCityToID(cityName):
    client = MongoClient('localhost', 27017)
    db = client['flights']
    collection = db['destinations']
    find = collection.find_one({"city": cityName})

    return find.get('_id')

def dict_to_list(list_of_cities):
	list = []
	for city in list_of_cities:
		list.append(city["city"])
	return list


def GetCities():
    with open('Destinastion.json') as f:
        data = json.load(f)
        data = dict_to_list(data)
        # data = map(lambda value: value['city'], data)
        return data
    


# Change this to your own chromedriver path!
chromedriver_path = 'C:/chromedriver/chromedriver.exe'

driver = webdriver.Chrome(executable_path=chromedriver_path) # This will open the Chrome window
sleep(2)
st = start_kayak("TLV", "Tirana", "2020-07-10", "2020-07-17")
print(st)

# cities = GetCities()
# source = 'TLV'
# for x in range(0,len(cities)-3):
#     destination =cities[x]
    
#     week = datetime.timedelta(weeks=1) 
#     date1 =  datetime.datetime.today()
#     date2 = date1 + week * 52   # The next year
   
#     while date1 <= date2:
#         date = date1.strftime('%m/%d/%Y')
#         date1 = date1 + week
      
#         print("Fetching flight details")
#         scraped_data = parse(source,destination,date)

#         if(scraped_data == {"error":"failed to process the page",}):
#             print("Failed")
#             continue

#         print("Save to DB")
#         date = date1.strftime('%d %m %Y')
#         SaveAndParseToDB(scraped_data,destination,date)


#         with open('%s-%s-%s-flight-results.json'%(source,destination,date),'w') as fp:
#            json.dump(scraped_data,fp,indent = 4)

