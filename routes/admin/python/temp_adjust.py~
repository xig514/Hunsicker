'''
Created on 2016.5.2

@author: Tina Lu
'''

import matplotlib.pyplot as plt
import numpy as np
import csv
import math
from scipy.optimize import minimize
import sys



'''
Variables:
    R    Specific Gas Constant (J/Kg*K)
    T_cold    Cold Temperature (K)
    T_hot    Hot Temperature (K)
    P_amb    Ambient Pressure (Pa)
    P_cold    Measured Pressure Drop (Pa)
    D_in    Diameter of Pipe (inch)
    D_m    Diameter of Pipe (meter)
    Vol_scfm    Volumetric Flow Rate (SCFM)
    Vol_mps    Volumetric Flow Rate (m/s)   
    A_pipe    Cross Sectional Area of Pipe (m^2)
    Den_cold    Cold Air Density (kg/m^3)
    M_cold    Cold Air Mass Flow Rate (Kg/s)
    V_cold    Cold Air Velocity (m/s)
    Mu_cold    Cold Air Viscosity (Kg/m*s)
        
    Re_cold    Cold Air Reynolds Number
    Pd_cold    Cold Air Dynamic Pressure (Pa)
    K           Cold Air Loss Coefficient
        
    P_hot    Hot Air Pressure Drop (KPa)
        
    Pd_hot    Hot Air Dynamic Pressure  (Pa)
    Den_hot    Hot AIr Density (kg/m^3)
    V_hot    Hot Air Velocity (m/s)
    Mu_hot    Hot Air Viscosity (Kg/m*s)
    M_hot    Hot Air Mass Flow Rate (g/s)
        
    Re_hot    Hot Air Reynolds Number
'''

PSI_list = [0.055,0.094,0.137,0.169,0.193,0.21,0.231,0.251,0.275,0.299,0.313 ]
SV =[27209.30716,43505.59642,54370.89203,65206.30303,76032.86783,81461.88178,86850.83417,92255.42073,97635.54572,103026.2914,108397.946]
vol=0.372
def temp_adjust(n):
    
    #Inputs from Database
    PSI=PSI_list[n];
  
    sv= SV[n]
    #Vol_scfm = sv*1000 * vol /60.0
    Vol_scfm=sv
    P_cold =  PSI * 6.89476
    #print P_cold, Vol_scfm
    
    #User Defined Inputs
    max_iteration = 50
    T_cold = 294.0
    T_hot = 866.0
    D_in = 4.0
    
    R = 286.9
    P_amb = 101.325
    
    
    #Decision Var
    P_hot =0
    

    
    Vol_mps =Vol_scfm/2119.0
    
    #Pipe Info
    D_m = D_in/39.37
    A_pipe = math.pi*(pow(D_m, 2))/4
    
    Den_cold = (P_amb+P_cold)*1000/(R*T_cold)
    M_cold =Vol_mps * Den_cold 
    V_cold = M_cold/(Den_cold*A_pipe)
    Mu_cold = (145.8*pow(T_cold,1.5))/(T_cold+110.4)*(1*pow(10,-8))
    Re_cold = Den_cold*V_cold*D_m/Mu_cold
    #print Re_cold,"recold"
    
   
    Pd_cold = 0.5*Den_cold*pow(V_cold,2)
    K = P_cold*1000/Pd_cold
    
    
    difference = 1000
    count = 0
    
    Pd_hot = 0
    Den_hot = 0
    V_hot = 0
    Mu_hot = 0
    M_hot = 0
    Re_hot = 0
    #print Re_hot,"re hot"
    
    
    recur = 0
    while ((Re_hot!=Re_cold)&(count <= max_iteration)):
        count +=1
        Pd_hot = P_hot * 1000 / K
        Den_hot = (P_hot + P_amb) * 1000 / (T_hot * R)
        V_hot = math.sqrt(2*Pd_hot/Den_hot)
        Mu_hot = 145.8*pow(T_hot,1.5)*pow(10,-8)/(T_hot+110.4)
        M_hot = V_hot * Den_hot * A_pipe * 1000
        Re_hot = (4*M_hot)/(math.pi*Mu_hot*D_m)/1000
        
        difference = Re_cold - Re_hot
        if difference > 0:
            P_hot = P_hot + difference/(7000/P_cold)
        else:
            temp = P_hot
            P_hot = P_hot + difference/(math.pow(10, recur))
            while P_hot <= 0:
                recur += 1
                P_hot = temp
                P_hot = P_hot + difference/(math.pow(10, recur))

    return P_hot
##print "Iteration", count,"diff:", difference
#    print str(sv_list[n]) +"    "+str(P_hot)
#    print   "//////////////Variables/////////////"
#    print    "    T_cold    "    ,    T_cold
#    print    "    T_hot    "    ,    T_hot
#    print    "    P_amb    "    ,    P_amb
#    print    "    P_cold    "    ,    P_cold
#    print    "    D_in    "    ,    D_in
#    print    "    D_m    "    ,     D_m
#    print    "    Vol_scfm    "    ,    Vol_scfm
#    print    "    Vol_mps    "    ,    Vol_mps
#
#
#    print    "    A_pipe    "    ,    A_pipe
#    print    "    Den_cold    "    ,    Den_cold
#    print    "    M_cold    "    ,    M_cold
#    print    "    V_cold    "    ,    V_cold
#    print    "    Mu_cold    "    ,    Mu_cold
#
#
#    print    "    Pd_cold    "    ,    Pd_cold
#    print    "    K    "    ,    K
#
#    print    "    P_hot    "    ,    P_hot
#
#    print    "    Pd_hot    "    ,    Pd_hot
#    print    "    Den_hot    "    ,    Den_hot
#    print    "    V_hot    "    ,    V_hot
#    print    "    Mu_hot    "    ,    Mu_hot
#    print    "    M_hot    "    ,    M_hot
#
#    print    "    Re_cold    "    ,    Re_cold
#    print    "    Re_hot    "    ,    Re_hot
#
#    print   "Number of iteration takes: ", count
#    print  "Final Decision Variable: ", P_hot
P_hot_list =[]
c = np.polyfit(SV,PSI_list, 2)
SV= np.array(SV)

#print "constant A:", c[0]
#print "constant B:",c[1]
#print "constant C:",c[2]
    
theo = []
for x in SV:
    theo.append(c[0]*x*x+c[1]*x+c[2])


for n in range(0,11):
    #print n
    
    P_hot_list.append( temp_adjust(n)/6.89476)
print P_hot_list
plt.plot(SV,PSI_list,'x',markersize=5,label='before')
plt.plot(SV,P_hot_list,'ro',markersize=5,label='after')
plt.plot(SV, theo,label='regression')
#plt.xlabel("Spave Velocity 1/hr")
#plt.ylabel("PSI")
#plt.legend()
plt.savefig('../../../public/myfig.png')
plt.show()

