'''
Created on 2016.2.2

@author: tinalu
'''
import sys
import matplotlib.pyplot as plt
import numpy as np
import csv



def parsedata(file_name):
   
    data = []
    
    for arg in sys.argv:

        PSI.append(arg)
    
    data=[PSI,SV]

    return data



if __name__ == '__main__':
    #PSI=[]
    PSI = [0.055,0.094,0.12,0.152,0.186,0.2,0.222,0.241,0.265,0.287,0.313 ]
    args_temp=[]
    SV =[27209.30716,43505.59642,54370.89203,65206.30303,76032.86783,81461.88178,86850.83417,92255.42073,97635.54572,103026.2914,108397.946]
    vol = 0.372;
    '''
    for arg in sys.argv:
        
        args_temp.append(arg)
        

    count = len(PSI)
    
    for i range(0,11):
        PSI.append(args_temp[i])
    vol=args_temp[11]
    '''
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
    plt.savefig('myfig.png')
    plt.show()
     
     
     
     
     
 
     
 
     
       
   
    
