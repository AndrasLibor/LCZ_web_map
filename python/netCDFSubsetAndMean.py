# coding: utf-8

# This code makes a subset from an nc and calculates the mean value along the time dimension.

# The 'change here' comments throughout the code are for helping the orientation of the user, since this code was used for more nc files - at key points points of the code
# variable names or arguments have to be changed


# importing necessary libraries
import numpy as np
from netCDF4 import*



#reading in original nc files to access climate data
nc = Dataset('nc_files/tmin.nc','r')    # change here


# creating new nc file, which will contain the subset of the whole climate data set
nc_subset = Dataset('nc_files/tmin_subset.nc', 'w', format = 'NETCDF3_CLASSIC')    # change here
nc_subset.close()

# after closing the file, opening it again in 'append' mode
nc_subset = Dataset('nc_files/tmin_subset.nc', 'a')    # change here

# creating dimensions for the subset nc file - the dimensions names and length has to be given as arguments
lon = nc_subset.createDimension('lon', 101)
lat = nc_subset.createDimension('lat', 61)
time = nc_subset.createDimension('time', 10958)

# here variables are created with the arguments: name, data type (32-bit and 64-bit floating point in our case) and a tuple of dimension name(s) our variable is defined upon
# You can see the 'tmin' minimum temperature value is defined along 3 dimensions: latitude, longitude and time
lonVar = nc_subset.createVariable('lon', 'f8', ('lon',))
latVar = nc_subset.createVariable('lat', 'f8', ('lat',))
timeVar = nc_subset.createVariable('time', 'f8', ('time',))
tmin = nc_subset.createVariable('tmin', 'f4', ('time', 'lat', 'lon',))    # change here


# in this step units of variables and file description is set
lonVar.units = 'degrees_east'
latVar.units = 'degrees_north'
timeVar.units = 'minutes since 1961-01-01 12:00'
tmin.units = 'C'                                 # change here
nc_subset.description = 'Made by: Andras Libor'

# here the values of the subset files' variables are set based on the original nc file: spatial extent is the same, but data is only need from 1981.01.01 which is 7305th day of the
# original dataset
lonVar[:] = nc.variables['lon'][:]
latVar[:] = nc.variables['lat'][:]
timeVar[:] = nc.variables['time'][7304:]
tmin[:,:,:] =  nc.variables['tmin'][7304:,:,:]    # change here

# closing up the original and the subset nc files
nc_subset.close()
nc.close()




#--------------------------------------- In this section the calculations of the mean value along time dimension for a given nc file takes place



# opening the subset dataset created earlier
nc_subset = Dataset('nc_files/tmin_subset.nc','r')    # change here

# creating a new dataset for the mean values
nc_subset_mean = Dataset('nc_files/tmin_subset_mean.nc', 'w', format = 'NETCDF3_CLASSIC')    # change here
nc_subset_mean.close()

# after closing the file, opening it again in 'append' mode
nc_subset_mean = Dataset('nc_files/tmin_subset_mean.nc', 'a')    # change here

# defining dimensions of the nc file - notice that 'time' dimensions length is only 1 - since we don't need any more, this is for mean value
lon = nc_subset_mean.createDimension('lon', 101)
lat = nc_subset_mean.createDimension('lat', 61)
time = nc_subset_mean.createDimension('time', 1)

# variables for the nc files are created along the dimension, just like before
lonVar = nc_subset_mean.createVariable('lon', 'f8', ('lon',))
latVar = nc_subset_mean.createVariable('lat', 'f8', ('lat',))
timeVar = nc_subset_mean.createVariable('time', 'f8', ('time',))
tmin_mean = nc_subset_mean.createVariable('tmin', 'f4', ('time', 'lat', 'lon',))    # change here

# in this step units of variables and file description is set
lonVar.units = 'degrees_east'
latVar.units = 'degrees_north'
timeVar.units = 'minutes since 1961-01-01 12:00'
tmin_mean.units = 'C'                                   # change here
nc_subset_mean.description = 'Made by: Andras Libor'

# defining the variables of mean dataset based on the subset dataset - the 'tmin' mean variables are going to be defined separately in the next steps
lonVar[:] = nc_subset.variables['lon'][:]
latVar[:] = nc_subset.variables['lat'][:]
timeVar[0] = nc_subset.variables['time'][0]


# this is the key part of the code, where a mean temperature is calculated for certain locations in space, across time
# for this purpose a triple nested for loop is created, which first enters a certain latitude and then longitude value
# in the next step an empty list variable is created and in the final for loop - which iterates through time
# as the loop iterates through time, the measured temperature values in the certain location are appended to the list
# in the final step the mean temperature value for given location is calculated and set for the 'tmin_mean' variable for a certain location in space
for latIndex in range(0, len(nc_subset.dimensions['lat'])):
    for lonIndex in range(0, len(nc_subset.dimensions['lon'])):
        temps = []
        for timeIndex in range(0, len(nc_subset.dimensions['time'])):
            temps.append(nc_subset.variables['tmin'][timeIndex][latIndex][lonIndex])    # change here
            
        tmin_mean[0,latIndex,lonIndex] =  np.mean(temps)    # change here
    print lonIndex, latIndex, timeIndex
        

# here the new and the subset nc files are closed
nc_subset_mean.close()
nc_subset.close()

# clearing some variables from the memory
del temps, latIndex, lonIndex, timeIndex
