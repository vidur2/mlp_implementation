import seaborn as sns
import matplotlib.pyplot as plt

def main():
    df = sns.load_dataset('iris')
    df.head()

    sns.boxplot( x=df["sepal_length"], y=df["species"] )
    plt.show()

if __name__ == '__main__':
    main()