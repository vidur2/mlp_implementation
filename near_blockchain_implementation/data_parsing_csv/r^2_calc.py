'''
Takes data measurements and calculates r^2 value
Science Fair
Vidur Modgil
'''

import pandas as pd

def main():
    df = pd.read_csv("./1-3-1_results.csv")
    df = df.transpose()
    df = df.dropna()
    print(df.corr())

if __name__ == '__main__':
    main()