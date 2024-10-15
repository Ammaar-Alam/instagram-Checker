/*--------------------------------------------------------------------*/
/* json_parser.h                                                      */
/* Author: Ammaar Alam                                                */
/*--------------------------------------------------------------------*/

#include "hashtable.h"
#include <stdio.h>
#include <stdlib.h>

/* function that will read the json files */
char* readFile(const char* filename);

/* finds each instance of "value": and extracts the username that follows */
void extractUsernames (const char* jsonData, SymTable_T table);

/* checks if each user from the "following" table exists in the "followers"
table, and vice versa */
void compareTables (SymTable_T following, SymTable_T followers);
