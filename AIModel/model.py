import openmeteo_requests
import sqlite3
import requests_cache
import pandas as pd
from retry_requests import retry

# Setup the Open-Meteo API client with cache and retry on error
cache_session = requests_cache.CachedSession('.cache', expire_after = 3600)
retry_session = retry(cache_session, retries = 5, backoff_factor = 0.2)
openmeteo = openmeteo_requests.Client(session = retry_session)

# Make sure all required weather variables are listed here
# The order of variables in hourly or daily is important to assign them correctly below
# climate data
url = "https://climate-api.open-meteo.com/v1/climate"
params = {
	"latitude": 51.5,
	"longitude": 10.5,
	"start_date": "1950-01-01",
	"end_date": "2050-12-31",
	"models": ["CMCC_CM2_VHR4", "FGOALS_f3_H", "HiRAM_SIT_HR", "MRI_AGCM3_2_S", "EC_Earth3P_HR", "MPI_ESM1_2_XR", "NICAM16_8S"],
	"daily": ["temperature_2m_mean", "temperature_2m_max", "temperature_2m_min", "wind_speed_10m_mean", "wind_speed_10m_max", "cloud_cover_mean", "shortwave_radiation_sum", "relative_humidity_2m_mean", "relative_humidity_2m_max", "relative_humidity_2m_min", "dew_point_2m_mean", "dew_point_2m_min", "dew_point_2m_max", "precipitation_sum", "rain_sum", "snowfall_sum", "pressure_msl_mean", "soil_moisture_0_to_10cm_mean", "et0_fao_evapotranspiration_sum"]
}
responses = openmeteo.weather_api(url, params=params)

# Process first location. Add a for-loop for multiple locations or weather models
response = responses[0]
print(f"Coordinates {response.Latitude()}°N {response.Longitude()}°E")
print(f"Elevation {response.Elevation()} m asl")
print(f"Timezone {response.Timezone()} {response.TimezoneAbbreviation()}")
print(f"Timezone difference to GMT+0 {response.UtcOffsetSeconds()} s")

# Process daily data. The order of variables needs to be the same as requested.
daily = response.Daily()
daily_temperature_2m_mean = daily.Variables(0).ValuesAsNumpy()
daily_temperature_2m_max = daily.Variables(1).ValuesAsNumpy()
daily_temperature_2m_min = daily.Variables(2).ValuesAsNumpy()
daily_wind_speed_10m_mean = daily.Variables(3).ValuesAsNumpy()
daily_wind_speed_10m_max = daily.Variables(4).ValuesAsNumpy()
daily_cloud_cover_mean = daily.Variables(5).ValuesAsNumpy()
daily_shortwave_radiation_sum = daily.Variables(6).ValuesAsNumpy()
daily_relative_humidity_2m_mean = daily.Variables(7).ValuesAsNumpy()
daily_relative_humidity_2m_max = daily.Variables(8).ValuesAsNumpy()
daily_relative_humidity_2m_min = daily.Variables(9).ValuesAsNumpy()
daily_dew_point_2m_mean = daily.Variables(10).ValuesAsNumpy()
daily_dew_point_2m_min = daily.Variables(11).ValuesAsNumpy()
daily_dew_point_2m_max = daily.Variables(12).ValuesAsNumpy()
daily_precipitation_sum = daily.Variables(13).ValuesAsNumpy()
daily_rain_sum = daily.Variables(14).ValuesAsNumpy()
daily_snowfall_sum = daily.Variables(15).ValuesAsNumpy()
daily_pressure_msl_mean = daily.Variables(16).ValuesAsNumpy()
daily_soil_moisture_0_to_10cm_mean = daily.Variables(17).ValuesAsNumpy()
daily_et0_fao_evapotranspiration_sum = daily.Variables(18).ValuesAsNumpy()

daily_data = {"date": pd.date_range(
	start = pd.to_datetime(daily.Time(), unit = "s", utc = True),
	end = pd.to_datetime(daily.TimeEnd(), unit = "s", utc = True),
	freq = pd.Timedelta(seconds = daily.Interval()),
	inclusive = "left"
)}
daily_data["temperature_2m_mean"] = daily_temperature_2m_mean
daily_data["temperature_2m_max"] = daily_temperature_2m_max
daily_data["temperature_2m_min"] = daily_temperature_2m_min
daily_data["wind_speed_10m_mean"] = daily_wind_speed_10m_mean
daily_data["wind_speed_10m_max"] = daily_wind_speed_10m_max
daily_data["cloud_cover_mean"] = daily_cloud_cover_mean
daily_data["shortwave_radiation_sum"] = daily_shortwave_radiation_sum
daily_data["relative_humidity_2m_mean"] = daily_relative_humidity_2m_mean
daily_data["relative_humidity_2m_max"] = daily_relative_humidity_2m_max
daily_data["relative_humidity_2m_min"] = daily_relative_humidity_2m_min
daily_data["dew_point_2m_mean"] = daily_dew_point_2m_mean
daily_data["dew_point_2m_min"] = daily_dew_point_2m_min
daily_data["dew_point_2m_max"] = daily_dew_point_2m_max
daily_data["precipitation_sum"] = daily_precipitation_sum
daily_data["rain_sum"] = daily_rain_sum
daily_data["snowfall_sum"] = daily_snowfall_sum
daily_data["pressure_msl_mean"] = daily_pressure_msl_mean
daily_data["soil_moisture_0_to_10cm_mean"] = daily_soil_moisture_0_to_10cm_mean
daily_data["et0_fao_evapotranspiration_sum"] = daily_et0_fao_evapotranspiration_sum

daily_dataframe = pd.DataFrame(data = daily_data)
daily_dataframe.to_csv('dailyDataframe.csv', index=False)
df = pd.read_csv('/Users/aarshochatterjee/Documents/models/prediction_market/dailyDataframe.csv')
df_cleaned = df.dropna(axis=1, how='all')
df_cleaned.to_csv('dailyDataframe.csv', index=False)

# converting the csv to sqlite db
csv_file = '/Users/aarshochatterjee/Documents/models/prediction_market/dailyDataframe.csv'
sqlite_db = 'testDatabase.db'
table_name = 'Climate'

df = pd.read_csv(csv_file)
conn = sqlite3.connect(sqlite_db)
df.to_sql(table_name, conn, if_exists='replace', index=False)

# air quality
url = "https://air-quality-api.open-meteo.com/v1/air-quality"
params = {
	"latitude": 51.5,
	"longitude": 10.5,
	"current": ["european_aqi", "us_aqi", "pm10", "pm2_5", "carbon_monoxide", "nitrogen_dioxide", "sulphur_dioxide", "ozone", "aerosol_optical_depth", "dust", "uv_index", "uv_index_clear_sky"],
	"hourly": ["pm10", "pm2_5", "carbon_monoxide", "nitrogen_dioxide", "sulphur_dioxide", "ozone", "aerosol_optical_depth", "dust", "uv_index", "uv_index_clear_sky", "european_aqi", "european_aqi_pm2_5", "european_aqi_pm10", "european_aqi_nitrogen_dioxide", "european_aqi_ozone", "european_aqi_sulphur_dioxide", "us_aqi", "us_aqi_pm2_5", "us_aqi_pm10", "us_aqi_nitrogen_dioxide", "us_aqi_carbon_monoxide", "us_aqi_ozone", "us_aqi_sulphur_dioxide"],
	"past_days": 92,
	"forecast_days": 7
}
responses = openmeteo.weather_api(url, params=params)

# Process first location. Add a for-loop for multiple locations or weather models
response = responses[0]
print(f"Coordinates {response.Latitude()}°N {response.Longitude()}°E")
print(f"Elevation {response.Elevation()} m asl")
print(f"Timezone {response.Timezone()} {response.TimezoneAbbreviation()}")
print(f"Timezone difference to GMT+0 {response.UtcOffsetSeconds()} s")

# Current values. The order of variables needs to be the same as requested.
current = response.Current()
current_european_aqi = current.Variables(0).Value()
current_us_aqi = current.Variables(1).Value()
current_pm10 = current.Variables(2).Value()
current_pm2_5 = current.Variables(3).Value()
current_carbon_monoxide = current.Variables(4).Value()
current_nitrogen_dioxide = current.Variables(5).Value()
current_sulphur_dioxide = current.Variables(6).Value()
current_ozone = current.Variables(7).Value()
current_aerosol_optical_depth = current.Variables(8).Value()
current_dust = current.Variables(9).Value()
current_uv_index = current.Variables(10).Value()
current_uv_index_clear_sky = current.Variables(11).Value()

print(f"Current time {current.Time()}")
print(f"Current european_aqi {current_european_aqi}")
print(f"Current us_aqi {current_us_aqi}")
print(f"Current pm10 {current_pm10}")
print(f"Current pm2_5 {current_pm2_5}")
print(f"Current carbon_monoxide {current_carbon_monoxide}")
print(f"Current nitrogen_dioxide {current_nitrogen_dioxide}")
print(f"Current sulphur_dioxide {current_sulphur_dioxide}")
print(f"Current ozone {current_ozone}")
print(f"Current aerosol_optical_depth {current_aerosol_optical_depth}")
print(f"Current dust {current_dust}")
print(f"Current uv_index {current_uv_index}")
print(f"Current uv_index_clear_sky {current_uv_index_clear_sky}")

# Process hourly data. The order of variables needs to be the same as requested.
hourly = response.Hourly()
hourly_pm10 = hourly.Variables(0).ValuesAsNumpy()
hourly_pm2_5 = hourly.Variables(1).ValuesAsNumpy()
hourly_carbon_monoxide = hourly.Variables(2).ValuesAsNumpy()
hourly_nitrogen_dioxide = hourly.Variables(3).ValuesAsNumpy()
hourly_sulphur_dioxide = hourly.Variables(4).ValuesAsNumpy()
hourly_ozone = hourly.Variables(5).ValuesAsNumpy()
hourly_aerosol_optical_depth = hourly.Variables(6).ValuesAsNumpy()
hourly_dust = hourly.Variables(7).ValuesAsNumpy()
hourly_uv_index = hourly.Variables(8).ValuesAsNumpy()
hourly_uv_index_clear_sky = hourly.Variables(9).ValuesAsNumpy()
hourly_european_aqi = hourly.Variables(10).ValuesAsNumpy()
hourly_european_aqi_pm2_5 = hourly.Variables(11).ValuesAsNumpy()
hourly_european_aqi_pm10 = hourly.Variables(12).ValuesAsNumpy()
hourly_european_aqi_nitrogen_dioxide = hourly.Variables(13).ValuesAsNumpy()
hourly_european_aqi_ozone = hourly.Variables(14).ValuesAsNumpy()
hourly_european_aqi_sulphur_dioxide = hourly.Variables(15).ValuesAsNumpy()
hourly_us_aqi = hourly.Variables(16).ValuesAsNumpy()
hourly_us_aqi_pm2_5 = hourly.Variables(17).ValuesAsNumpy()
hourly_us_aqi_pm10 = hourly.Variables(18).ValuesAsNumpy()
hourly_us_aqi_nitrogen_dioxide = hourly.Variables(19).ValuesAsNumpy()
hourly_us_aqi_carbon_monoxide = hourly.Variables(20).ValuesAsNumpy()
hourly_us_aqi_ozone = hourly.Variables(21).ValuesAsNumpy()
hourly_us_aqi_sulphur_dioxide = hourly.Variables(22).ValuesAsNumpy()

hourly_data = {"date": pd.date_range(
	start = pd.to_datetime(hourly.Time(), unit = "s", utc = True),
	end = pd.to_datetime(hourly.TimeEnd(), unit = "s", utc = True),
	freq = pd.Timedelta(seconds = hourly.Interval()),
	inclusive = "left"
)}
hourly_data["pm10"] = hourly_pm10
hourly_data["pm2_5"] = hourly_pm2_5
hourly_data["carbon_monoxide"] = hourly_carbon_monoxide
hourly_data["nitrogen_dioxide"] = hourly_nitrogen_dioxide
hourly_data["sulphur_dioxide"] = hourly_sulphur_dioxide
hourly_data["ozone"] = hourly_ozone
hourly_data["aerosol_optical_depth"] = hourly_aerosol_optical_depth
hourly_data["dust"] = hourly_dust
hourly_data["uv_index"] = hourly_uv_index
hourly_data["uv_index_clear_sky"] = hourly_uv_index_clear_sky
hourly_data["european_aqi"] = hourly_european_aqi
hourly_data["european_aqi_pm2_5"] = hourly_european_aqi_pm2_5
hourly_data["european_aqi_pm10"] = hourly_european_aqi_pm10
hourly_data["european_aqi_nitrogen_dioxide"] = hourly_european_aqi_nitrogen_dioxide
hourly_data["european_aqi_ozone"] = hourly_european_aqi_ozone
hourly_data["european_aqi_sulphur_dioxide"] = hourly_european_aqi_sulphur_dioxide
hourly_data["us_aqi"] = hourly_us_aqi
hourly_data["us_aqi_pm2_5"] = hourly_us_aqi_pm2_5
hourly_data["us_aqi_pm10"] = hourly_us_aqi_pm10
hourly_data["us_aqi_nitrogen_dioxide"] = hourly_us_aqi_nitrogen_dioxide
hourly_data["us_aqi_carbon_monoxide"] = hourly_us_aqi_carbon_monoxide
hourly_data["us_aqi_ozone"] = hourly_us_aqi_ozone
hourly_data["us_aqi_sulphur_dioxide"] = hourly_us_aqi_sulphur_dioxide

hourly_dataframe = pd.DataFrame(data = hourly_data)
hourly_dataframe.to_csv('hourlyDfAirQuality.csv', index=False)
df = pd.read_csv('/Users/aarshochatterjee/Documents/models/prediction_market/hourlyDfAirQuality.csv')
df_cleaned = df.dropna(axis=1, how='all')
df_cleaned.to_csv('hourlyDfAirQuality.csv', index=False)

# converting the csv to sqlite db
csv_file = '/Users/aarshochatterjee/Documents/models/prediction_market/hourlyDfAirQuality.csv'
sqlite_db = 'testDatabase.db'
table_name = 'AirQuality'

df = pd.read_csv(csv_file)
conn = sqlite3.connect(sqlite_db)
df.to_sql(table_name, conn, if_exists='replace', index=False)

# flood
url = "https://flood-api.open-meteo.com/v1/flood"
params = {
	"latitude": 51.5,
	"longitude": 10.5,
	"daily": ["river_discharge", "river_discharge_mean", "river_discharge_median", "river_discharge_max", "river_discharge_min", "river_discharge_p25", "river_discharge_p75"],
	"past_days": 92,
	"models": ["seamless_v4", "forecast_v4", "consolidated_v4"]
}
responses = openmeteo.weather_api(url, params=params)

# Process first location. Add a for-loop for multiple locations or weather models
response = responses[0]
print(f"Coordinates {response.Latitude()}°N {response.Longitude()}°E")
print(f"Elevation {response.Elevation()} m asl")
print(f"Timezone {response.Timezone()} {response.TimezoneAbbreviation()}")
print(f"Timezone difference to GMT+0 {response.UtcOffsetSeconds()} s")

# Process daily data. The order of variables needs to be the same as requested.
daily = response.Daily()
daily_river_discharge = daily.Variables(0).ValuesAsNumpy()
daily_river_discharge_mean = daily.Variables(1).ValuesAsNumpy()
daily_river_discharge_median = daily.Variables(2).ValuesAsNumpy()
daily_river_discharge_max = daily.Variables(3).ValuesAsNumpy()
daily_river_discharge_min = daily.Variables(4).ValuesAsNumpy()
daily_river_discharge_p25 = daily.Variables(5).ValuesAsNumpy()
daily_river_discharge_p75 = daily.Variables(6).ValuesAsNumpy()

daily_data = {"date": pd.date_range(
	start = pd.to_datetime(daily.Time(), unit = "s", utc = True),
	end = pd.to_datetime(daily.TimeEnd(), unit = "s", utc = True),
	freq = pd.Timedelta(seconds = daily.Interval()),
	inclusive = "left"
)}
daily_data["river_discharge"] = daily_river_discharge
daily_data["river_discharge_mean"] = daily_river_discharge_mean
daily_data["river_discharge_median"] = daily_river_discharge_median
daily_data["river_discharge_max"] = daily_river_discharge_max
daily_data["river_discharge_min"] = daily_river_discharge_min
daily_data["river_discharge_p25"] = daily_river_discharge_p25
daily_data["river_discharge_p75"] = daily_river_discharge_p75

daily_dataframe = pd.DataFrame(data = daily_data)
daily_dataframe.to_csv('dailyDFFlood.csv', index=False)
df = pd.read_csv('/Users/aarshochatterjee/Documents/models/prediction_market/dailyDFFlood.csv')
df_cleaned = df.dropna(axis=1, how='all')
df_cleaned.to_csv('dailyDFFlood.csv', index=False)

# converting the csv to sqlite db
csv_file = '/Users/aarshochatterjee/Documents/models/prediction_market/dailyDFFlood.csv'
sqlite_db = 'testDatabase.db'
table_name = 'Flood'

df = pd.read_csv(csv_file)
conn = sqlite3.connect(sqlite_db)
df.to_sql(table_name, conn, if_exists='replace', index=False)