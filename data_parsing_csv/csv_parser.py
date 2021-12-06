import pandas as pd
from math import cos
from math import sin
import random

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

def cast_yes_no(current_elem):
    if current_elem == "Yes":
        return 1
    elif current_elem == "No":
        return 0
    else: 
        return current_elem


def cast_direction_to_xy(direction):
    if(direction in possible_directions):
        return cos(possible_directions[direction]), sin(possible_directions[direction])
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

    # Splitting of the dataframe
    training_set = data.sample(frac=0.1, random_state=1)
    test_set = data[~data.isin(training_set)].dropna(how="all")
    # data.to_csv("./weather_output.csv")
    training_set = impute(training_set)
    test_set = impute(test_set)
    test_set.info()
    test_set = test_set.drop("RainTomorrow", 1)
    test_set = test_set[:5000]

    training_set.to_csv("./training.csv", index=False)
    test_set.to_csv("./test.csv", index=False)

    





if(__name__ == '__main__'):
    main()