# LCZ Web Map
This is a web map containing climate information on local climate zones (LCZs) in and around the town of Szeged, Hungary. The LCZ features show the mean values of daily mean, maximum and minimum temperature from the 1st of January, 1981 to the 1st of January, 2011.

This project has TWO main parts:

# 1) The processing and manipulation of the climate data

The mean, maximum and minimum temperatures were measured on a daily basis from the 1st of January, 1981 to the 1st of January, 2011. The mean, maximum and minimum data sets are stored in NetCDF files. Each temperature measurement is defined along 3 dimensions: Latitude, Longitude and Time. This way we can set every measurement in time and space.

For this project we need the mean values of climiate data only for the last 30 years, so the first step is to make a selection of the climate data and write it into a new NetCDF file, where we only store data from 1st of January, 1981. Then the mean temperature value is to be calculated for the same location along the time dimension. This process is to be made for the mean, the minimum and the maximum temperature data sets as well.

For this purpose Python is and ideal coding language since there is a package called netCDF4, which can be downloaded and installed via pip or any other package manager. The Python code for this part of the project can be found in the 'python' folder.

The data that is going to be visualized later is a vector dataset containing the local climate zones as polygons. The vector data set is also containing mean temperature values for each climate zone originated from the NetCDF files via zonal statistics. The zonal statistics and an export of the vector data to a GeoJSON format was made with the software QGIS. This GeoJSON file is later used as a JavaScript variable in the web map application.

# 2) The visualization of the climate data in a web map application

The function of the web map is for the user to be able to inspect the different mean temperature values of the climate zones by clicking on a feature on the web map. The attributes (LCZ type, mean values of mean, maximum and minimum temperatures) of the feature are listed on the right side of the web application by clicking the feature.

The web maps JavaScript code uses to OpenLayers functions to visualize the vector feaures of GeoJSON file passed on to the map as a JavaScript variable. It also uses various basemaps that can be switched: 2 road maps and an aerial map. The map has additional elements, like scale bar and zoom slider. The application also has an attribute based style, which colors the vector features based on their LCZ type.

The HTML, CSS and JavaScript codes can be found in the 
