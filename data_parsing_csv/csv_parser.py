import pandas as pd
from math import cos
from math import sin
import numpy as np
import matplotlib.pyplot as plt
from imblearn.under_sampling import RandomUnderSampler
from sklearn.model_selection import train_test_split
import random
import seaborn as sns

# HashMap of values to cast direction to numeric
possible_directions = {
    'N': 0.0,
    'NNE': 45/2,
    'NE': 2 * 45/2,
    'ENE': 3 * 45/2,
    'E': 4 * 45/2,
    'ESE': 5 * 45/2,
    'SE': 6 * 45/2,
    'SSE': 7 * 45/2,
    'S': 8 * 45/2,
    'SSW': 9 * 45/2,
    'SW': 10 * 45/2,
    'WSW': 11 * 45/2,
    'W': 12 * 45/2,
    'WNW': 13 * 45/2,
    'NW': 14 * 45/2,
    'NNW': 15 * 45/2,
}

# Function which casts yes/no output to 0/1
def cast_yes_no(current_elem):
    if current_elem == "Yes":
        return 1
    elif current_elem == "No":
        return 0
    else: 
        return current_elem


# Changes degree input to xy to minimize bias in model from 0-360 (ie higher numbers wold be useless)
def cast_direction_to_xy(direction):
    if(direction in possible_directions):
        return cos(possible_directions[direction]), sin(possible_directions[direction])

    # Imputes a value of (0,0) if no wind dir is given to minimize bias
    else: 
        return 0.0, 0.0


def impute(data):
    # Nessescary imputation done here
    means = {}
    possible_locations = set(data["Location"])

    for location in possible_locations:
        data[data["Location"] == location] = data[data["Location"] == location].fillna(data[data["Location"] == location].mean())
    
    data.fillna(data.mean(), inplace=True)
    data.drop("Location", axis=1, inplace=True)

    return data


def main():
    pd.options.mode.chained_assignment = None
    # Translating Variables into being readable by the algorithm
    data = pd.read_csv("./weatherAUS.csv")
    data.drop(["Date"], 1, inplace=True)

    col1 = list(map(cast_direction_to_xy, list(data["WindGustDir"])))
    col2 = list(map(cast_direction_to_xy, list(data["WindDir9am"])))
    col3 = list(map(cast_direction_to_xy, list(data["WindDir3pm"])))

    col1x, col1y = zip(*col1)
    col2x, col2y = zip(*col2)
    col3x, col3y = zip(*col3)

    data["WindGustDirX"] = col1x
    data["WindGustDirY"] = col1y

    data["WindDir9amX"] = col2x
    data["WindDir9amY"] = col2y

    data["WindDir3pmX"] = col3x
    data["WindDir3pmY"] = col3y

    data.drop("WindGustDir", axis=1, inplace=True)
    data.drop("WindDir9am", axis=1, inplace=True)
    data.drop("WindDir3pm", axis=1, inplace=True)
    
    data["RainToday"] = list(map(cast_yes_no, list(data["RainToday"])))
    data["RainTomorrow"] = list(map(cast_yes_no, list(data["RainTomorrow"])))
    data = data[data["RainTomorrow"].notna()]
    print(data[["MinTemp","RainToday","RainTomorrow"]].head())
    # Splitting of the dataframe
    x_df = data[data.columns[data.columns != "RainTomorrow"]]
    y_df = data["RainTomorrow"]
    rus = RandomUnderSampler(random_state=0)
    fully_resampled, y_resampled = rus.fit_resample(x_df, y_df)
    fully_resampled["RainTomorrow"] = y_resampled
 
    subset = fully_resampled.sample(frac=0.15, random_state=0)
    subset_x = subset[subset.columns[subset.columns != "RainTomorrow"]]
    subset_y = subset["RainTomorrow"].to_frame()
    full_train, full_test, y_train, y_test = train_test_split(subset_x, subset_y)
    columns = full_train.columns
    full_train["RainTomorrow"] = y_train
    full_test["RainTomorrow"] = y_test
    print(full_train[["MinTemp","RainToday","RainTomorrow"]].head())
    # for column in columns:
    #     ax = sns.boxplot(x = full_train["RainTomorrow"], y = full_train[str(column)])
    #     plt.show()
    print(full_train.columns)
    full_train = impute(full_train)
    full_test = impute(full_test)
    final_train = full_train[["Rainfall", "Sunshine", "WindGustSpeed", "Humidity3pm", "Pressure3pm", "Cloud9am", "RainTomorrow"]]
    final_test = full_test[["Rainfall", "Sunshine", "WindGustSpeed", "Humidity3pm", "Pressure3pm", "Cloud9am", "RainTomorrow"]]
    print(final_train.head())
    print(final_test.head())

    final_train.to_csv("./training.csv", index=False)
    final_test.to_csv("./test.csv", index=False)

    





if(__name__ == '__main__'):
    main()