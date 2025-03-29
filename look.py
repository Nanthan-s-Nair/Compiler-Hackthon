import sys
from collections import defaultdict

def analyze_tac(tac_file):
    op_counts = defaultdict(int)
    with open(tac_file, 'r') as f:
        for line in f:
            if '=' in line:
                rhs = line.split('=')[1].strip()
                if ' ' in rhs:
                    op = rhs.split(' ')[0].strip()
                    op_counts[op] += 1
    
    return op_counts

def generate_lut():

    lut = {
        'add': 'ADD',
        'sub': 'SUB',
        'mul': 'MUL',
        'load': 'LD',
        'store': 'ST',
        'icmp': 'CMP',
        'br': 'BR',
        'getelementptr': 'GEP',
        'sext': 'SEXT',
        'trunc': 'TRUNC',
        'phi': 'PHI'
    }
    
    print("Lookup Table:")
    for llvm_op, isa_op in lut.items():
        print(f"{llvm_op.ljust(15)} -> {isa_op}")

if __name__ == "__main__":
    generate_lut()
