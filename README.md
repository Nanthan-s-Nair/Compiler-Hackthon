# Compile-a-thon 25
A LLVM-based Custom ISA and Processing-in-Memory (PIM) Compilation Framework

## Overview
This repository provides a comprehensive framework for developing and simulating Processing-in-Memory (PIM) models and custom Instruction Set Architectures (ISA) using LLVM. The project integrates Python scripts, custom ISA definitions, and matrix computation tools to support effective PIM model generation and execution.

## Features
- **LLVM IR to Custom ISA Conversion**: Translates LLVM Intermediate Representation (IR) code into a custom ISA for enhanced flexibility in architecture design.
- **PIM Instruction Generation**: Generates PIM-specific instructions optimized for in-memory computing models.
- **Look-Up Table (LUT) Generation**: Facilitates the creation of efficient LUTs for matrix-based computations.
- **Enhanced Frontend Stream Processor**: Improves data streaming capabilities for optimized processing workflows.

## Directory Structure
```
project/                  # Main project folder (additional content may vary)
.DS_Store                 # System file (can be ignored)
FinalProgressDocumentation.pdf  # Detailed final project documentation
Progress2pm.pdf           # Intermediate progress report for PIM advancements

generate_lut.py           # Generates LUTs for faster matrix computations
generate_pPIM.py          # Generates PIM models for custom architectures
generate_tac.py           # Generates Three-Address Code (TAC) for instruction management

llvmtoPIM.py              # Converts LLVM IR to PIM-specific instruction set
llvmtoCustomISA.py        # Translates LLVM IR to a custom-defined ISA

look.py                   # Performs matrix-based operations and visualization
lut.py                    # LUT configurations and definitions for PIM models

matrix/                   # Contains matrix data, configurations, and scripts
matrix.cpp                # C++ implementation of matrix computation logic
matrix.ll                 # LLVM IR representation of matrix operations

output.isa                # Generated custom ISA output file
output_pPIM.isa           # Generated PIM-specific ISA output file

stream_updatedfrontend.py # Advanced frontend stream processing for PIM integration
```

## Prerequisites
- Python 3.8+
- LLVM 12.0 or higher
- Recommended Python packages:
  - `numpy`
  - `pandas`
  - `matplotlib`

## Installation
1. Clone the repository:
   ```bash
   git clone <repository_url>
   cd <repository_name>
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Verify LLVM installation and include its binaries in your system's PATH.

## Usage
### Generating Custom ISA
To translate LLVM IR code to custom ISA format:
```bash
python llvmtoCustomISA.py <input_file.ll>
```

### Generating PIM Instructions
For PIM-specific instruction generation:
```bash
python llvmtoPIM.py <input_file.ll>
```

### Generating Look-Up Tables (LUT)
To generate LUT files for optimized computation:
```bash
python generate_lut.py
```

### Executing Frontend Stream Processor
For improved data streaming and optimized PIM processing:
```bash
python stream_updatedfrontend.py
```

## Documentation
- **FinalProgressDocumentation.pdf** outlines the project's goals, methodology, and outcomes.
- **Progress2pm.pdf** is the first round of progress (submitted at 2pm)


## Project By
- **Nanthan S Nair** - 22BRS1070 - [nanthan.snair2022@vitstudent.ac.in](mailto:nanthan.snair2022@vitstudent.ac.in)
- **Kavin Karthik V** - 22BRS1049 - [kavinkarthik.v2022@vitstudent.ac.in](mailto:kavinkarthik.v2022@vitstudent.ac.in)
- **Mukunth S** - 22BRS1021 - [mukunth.s2022@vitstudent.ac.in](mailto:mukunth.s2022@vitstudent.ac.in)

