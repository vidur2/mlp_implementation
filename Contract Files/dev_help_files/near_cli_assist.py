import os, sys

def main():
    args = sys.argv[1:]
    acct_number = int(args[1])
    for i in range(acct_number):
        current_num = str(i + 1)
        os.system(f"near delete mlp{current_num}.perceptron.testnet perceptron.testnet")
        os.system(f"near create-account mlp{current_num}.perceptron.testnet --masterAccount perceptron.testnet --initialBalance 20")
    
    os.system("near state percpetron.testnet")

if __name__ == '__main__':
    main()