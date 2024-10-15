# The compiler to use
CC = gcc

# Compiler flags
CFLAGS = -Wall -Werror

# The name of the final executable
TARGET = instagram-following

# Object files
OBJS = main.o hashtable.o json_parser.o

# The rule to build the final executable
$(TARGET): $(OBJS)
    $(CC) $(CFLAGS) -o $(TARGET) $(OBJS)

# Rule to build main.o from main.c
main.o: main.c hashtable.h json_parser.h
    $(CC) $(CFLAGS) -c main.c

# Rule to build hashtable.o from hashtable.c
hashtable.o: hashtable.c hashtable.h
    $(CC) $(CFLAGS) -c hashtable.c

# Rule to build json_parser.o from json_parser.c
json_parser.o: json_parser.c json_parser.h
    $(CC) $(CFLAGS) -c json_parser.c

# Clean up (delete object files and the executable)
clean:
    rm -f $(OBJS) $(TARGET)
