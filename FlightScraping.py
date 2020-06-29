import json
import requests
from lxml import html
from collections import OrderedDict
import random
import datetime
import pymongo
from pymongo import MongoClient
import pprint

def parse(source,destination,date):
	for i in range(1):
		try:
			url = "https://www.expedia.com/Flights-Search?trip=oneway&leg1=from:{0},to:{1},departure:{2}TANYT&passengers=adults:1,children:0,seniors:0,infantinlap:Y&options=cabinclass%3Aeconomy&mode=search&origref=www.expedia.com".format(source,destination,date)
			print(url)
			headers = {'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.140 Safari/537.36'}
			response = requests.get(url, headers=headers, verify=False)
			print(response)
			parser = html.fromstring(response.text)
			json_data_xpath = parser.xpath("//script[@id='cachedResultsJson']//text()")
			raw_json =json.loads(json_data_xpath[0] if json_data_xpath else '')
			flight_data = json.loads(raw_json["content"])
			print(raw_json["content"])

			flight_info  = OrderedDict() 
			lists=[]

			for i in flight_data['legs'].keys():
				total_distance =  flight_data['legs'][i].get("formattedDistance",'')
				exact_price = flight_data['legs'][i].get('price',{}).get('totalPriceAsDecimal','')

				departure_location_airport = flight_data['legs'][i].get('departureLocation',{}).get('airportLongName','')
				departure_location_city = flight_data['legs'][i].get('departureLocation',{}).get('airportCity','')
				departure_location_airport_code = flight_data['legs'][i].get('departureLocation',{}).get('airportCode','')
				
				arrival_location_airport = flight_data['legs'][i].get('arrivalLocation',{}).get('airportLongName','')
				arrival_location_airport_code = flight_data['legs'][i].get('arrivalLocation',{}).get('airportCode','')
				arrival_location_city = flight_data['legs'][i].get('arrivalLocation',{}).get('airportCity','')
				airline_name = flight_data['legs'][i].get('carrierSummary',{}).get('airlineName','')
				
				no_of_stops = flight_data['legs'][i].get("stops","")
				flight_duration = flight_data['legs'][i].get('duration',{})
				flight_hour = flight_duration.get('hours','')
				flight_minutes = flight_duration.get('minutes','')
				flight_days = flight_duration.get('numOfDays','')

				if no_of_stops==0:
					stop = "Nonstop"
				else:
					stop = str(no_of_stops)+' Stop'

				total_flight_duration = "{0} days {1} hours {2} minutes".format(flight_days,flight_hour,flight_minutes)
				departure = departure_location_airport+", "+departure_location_city
				arrival = arrival_location_airport+", "+arrival_location_city
				carrier = flight_data['legs'][i].get('timeline',[])[0].get('carrier',{})
				plane = carrier.get('plane','')
				plane_code = carrier.get('planeCode','')
				formatted_price = "{0:.2f}".format(exact_price)

				if not airline_name:
					airline_name = carrier.get('operatedBy','')
				
				timings = []
				for timeline in  flight_data['legs'][i].get('timeline',{}):
					if 'departureAirport' in timeline.keys():
						departure_airport = timeline['departureAirport'].get('longName','')
						departure_time = timeline['departureTime'].get('time','')
						arrival_airport = timeline.get('arrivalAirport',{}).get('longName','')
						arrival_time = timeline.get('arrivalTime',{}).get('time','')
						flight_timing = {
											'departure_airport':departure_airport,
											'departure_time':departure_time,
											'arrival_airport':arrival_airport,
											'arrival_time':arrival_time
						}
						timings.append(flight_timing)

				flight_info={'stops':stop,
					'ticket price':formatted_price,
					'departure':departure,
					'arrival':arrival,
					'flight duration':total_flight_duration,
					'airline':airline_name,
					'plane':plane,
					'timings':timings,
					'plane code':plane_code
				}
				lists.append(flight_info)
			sortedlist = sorted(lists, key=lambda k: k['ticket price'],reverse=False)
			return sortedlist
		
		except ValueError:
			print "Rerying..."
			
	return {"error":"failed to process the page",}

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

def GetCities():
    with open('Destinastion.json') as f:
        data = json.load(f)
        data = map(lambda value: value['city'], data)
        return data
    

url = "https://www.expedia.com/Flights-Search?trip=oneway&leg1=from:TLV,to:Tirana,departure:07/20/2020TANYT&passengers=adults:1,children:0,seniors:0,infantinlap:Y&options=cabinclass%3Aeconomy&mode=search&origref=www.expedia.com"
#headers = {'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.140 Safari/537.36'}
response = requests.get(url, headers=None)
print(response)

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
      
#         print "Fetching flight details"
#         scraped_data = parse(source,destination,date)

#         if(scraped_data == {"error":"failed to process the page",}):
#             print "Failed"
#             continue

#         print "Save to DB"
#         date = date1.strftime('%d %m %Y')
#         SaveAndParseToDB(scraped_data,destination,date)


        #with open('%s-%s-%s-flight-results.json'%(source,destination,date),'w') as fp:
        #    json.dump(scraped_data,fp,indent = 4)

