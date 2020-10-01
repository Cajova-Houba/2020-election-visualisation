import csv
import json
import time
from geopy.geocoders import Nominatim

CITY_ITEM = 6
PARTY_ITEM = 4

def parseRow(row, cityPartyCountDictionary):
    """
    Parses data from given row and updates cityPartyCountDictionary accordingly.
    """
    city = row[CITY_ITEM]
    party = row[PARTY_ITEM]

    if not city in cityPartyCountDictionary:
        cityPartyCountDictionary[city] = {}
    
    if not party in cityPartyCountDictionary[city]:
        cityPartyCountDictionary[city][party] = 0
    
    currentCount = cityPartyCountDictionary[city][party]
    currentCount = currentCount + 1
    cityPartyCountDictionary[city][party] = currentCount

def processRows(rows):
    """
    Process of the csv file.

    Returns dictionary with city->party->count
    """

    cityPartyCount = {}

    for row in rows:
        parseRow(row, cityPartyCount)
    return cityPartyCount

def readCsvFile(fileName):
    """
    Reads the CSV files and returns array of arrays representing its rows.
    """
    data = []
    with open(fileName, encoding='utf-8') as csv_file:
        csv_reader = csv.reader(csv_file, delimiter=';')

        # skip header
        next(csv_reader, None)

        for row in csv_reader:
            data.append(row)
        
    return data

def assignColoursToPartis(cityPartyCount):
    """
    Returns a dictionary of party -> colour.
    """
    partyColour = {}

    for city in cityPartyCount.keys():
        for party in cityPartyCount[city].keys():
            if not party in partyColour:
                partyColour[party] = "black"
    return partyColour

def assignLatLonToCities(cityPartyCount):
    """
    Return a dictionary of city-> [lat,lon]
    """
    geolocator = Nominatim(user_agent="cz-election-usti-region-2020")
    cityLatLon = {}

    for city in cityPartyCount.keys():
        if not city in cityLatLon:
            location = geolocator.geocode(city)
            cityLatLon[city] = []
            cityLatLon[city].append(location.latitude)
            cityLatLon[city].append(location.longitude)

            # polite wait
            time.sleep(1.5)

    
    return cityLatLon
    

def saveResults(cityPartyCount, outFileName):
    """
    Stores the dictionary into json file.
    """
    with open(outFileName+'.json', 'w', encoding='utf-8') as fp:
        json.dump(cityPartyCount, fp, ensure_ascii=False)

def main():
    rows = readCsvFile("ustecky-kraj-kandidati.csv")
    results = processRows(rows)
    partyColours = assignColoursToPartis(results)
    #cityLatLon = assignLatLonToCities(results)
    saveResults(results, "results")
    #saveResults(partyColours, "partyColours")
    #saveResults(cityLatLon, "cityLatLon")

main()