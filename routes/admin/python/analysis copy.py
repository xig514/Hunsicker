'''
Created on 2016.2.2

@author: tinalu
'''
import sys
import matplotlib.pyplot as plt
import numpy as np
import csv






def parsedata(file_name):
    f = open(file_name,'rU')
    data = []
    PSI=[]
    SV=[]
    for line in f:
        point = []
        if (len(line)>1):
            point = line.split()
        PSI.append(float(point[0]))
        SV.append(float(point[1]))
    data=[PSI,SV]
    print data[0]
    print data[1]
    return data



if __name__ == '__main__':
    PSI = []
    SV=[]
    with open('data.csv') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            PSI.append(float(row['PSI']))
            SV.append(float(row['SV']))
    

    print PSI
      
    count = len(PSI)
    print count, "data points"
    c = np.polyfit(SV,PSI, 2)
    print "constant A:", c[0]
    print "constant B:",c[1]
    print "constant C:",c[2]
  
    theo = []
    for x in SV:
        theo.append(c[0]*x*x+c[1]*x+c[2])   
          
  
    plt.plot(SV,PSI,'ro',markersize=5,label='real')
    plt.plot(SV, theo,label='regression')
    plt.xlabel("Spave Velocity 1/hr")
    plt.ylabel("PSI")
    plt.legend()
    plt.show()
     
     
     
     
     
 
     
 
     
       
   
    
