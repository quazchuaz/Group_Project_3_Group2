'''
This script download all daily fire hotspot report from
gorverment website: "https://cwfis.cfs.nrcan.gc.ca/downloads/hotspots/".
And also merge all indivisual daily csv file as one "fire.csv"
'''
import requests
import csv

months = range(1, 9)
days = {
    "1": 31,
    "2": 28,
    "3": 31,
    "4": 30,
    "5": 31,
    "6": 30,
    "7": 31,
    "8": 31
}
fields = ["lat", "lon", "rep_date", "source", "sensor", "fwi", "fuel", "ros", "sfc", "tfc", "bfc", "hfi", "estarea"]

header_created = False
for month in months:
    for day in range(days[str(month)]+1):
        if day == 0:
            continue

        if day < 10:
            file_name = f"20230{month}0{day}.csv"
        else:
            file_name = f"20230{month}{day}.csv"
    
        with requests.get(f"https://cwfis.cfs.nrcan.gc.ca/downloads/hotspots/{file_name}", stream=True) as r:
            r.raise_for_status()

            with open("fire.csv", 'a', newline='') as f:
                decoded_content = r.content.decode('utf-8')

                cr = csv.reader(decoded_content.splitlines(), delimiter=',')
                my_list = list(cr)

                write = csv.writer(f)
                if not header_created:
                    header_created = True
                    write.writerow(fields)

                write.writerows(my_list[1:])
