# LCZ web map
This is a web map containing climate information on local climate zones (LCZs) in and around the town of Szeged, Hungary. The LCZ features show the mean values of daily mean, maximum and minimum temperature from the 1st of January,1981 to the 1st of January, 2011.

This project has TWO main parts:

# (1) The processing and manipulation of the climate data

The mean, maximum and minimum temperatures were measured on a daily basis from the 1st of January,1981 to the 1st of January, 2011. The mean, maximum and minimum data sets are stored in NetCDF files. Each temperature measurement is defined along 3 dimensions: Latitude, Longitude and Time. This way we can set every measurement in time and space.

For this project we need the mean values of climiate data only for the last 30 years, so the first step is to make a selection of the climate data and write it into a new NetCDF file, where we only store data from 1st of January, 1981.

Then the mean temperature value is to be calculated for the same location along the time dimension. This process is to be made for the mean, the minimum and the maximum temperature data sets as well.

For this purpose Python is and ideal coding language since there is a package called netCDF4, which can be downloaded and installed via pip or any other package manager.

# (2) The visualization of the climate data in a web map application
