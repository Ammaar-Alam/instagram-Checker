# Compiler to use
CC = gcc

# Compiler flags
CFLAGS = -Wall -Werror -g

# The target executable name
TARGET = instagram-Checker

# Object files
OBJS = main.o json_parser.o hashtable.o

# Default target
all: $(TARGET)

# Rule to link the program
$(TARGET): $(OBJS)
	$(CC) $(CFLAGS) -o $(TARGET) $(OBJS)
	chmod +x $(TARGET)

# Rules for compiling source files to object files
main.o: main.c hashtable.h json_parser.h
	$(CC) $(CFLAGS) -c main.c

json_parser.o: json_parser.c json_parser.h hashtable.h
	$(CC) $(CFLAGS) -c json_parser.c

hashtable.o: hashtable.c hashtable.h
	$(CC) $(CFLAGS) -c hashtable.c

# Rule to clean up the build
clean:
	rm -f $(OBJS) $(TARGET)

# Phony targets
.PHONY: all clean
