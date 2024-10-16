/*--------------------------------------------------------------------*/
/* main.c                                                             */
/* Author: Ammaar Alam                                                */
/*--------------------------------------------------------------------*/

#include <stdio.h>
#include <stdlib.h>
#include "hashtable.h"
#include "json_parser.h"

int main(int argc, char *argv[]) {
    if (argc != 3) {
        printf("Usage: %s <following_file> <followers_file>\n", argv[0]);
        return 1;
    }

    printf("Attempting to open following file: %s\n", argv[1]);
    printf("Attempting to open followers file: %s\n", argv[2]);

    /* read the JSON files for following and followers */
    char *followingJson = readFile(argv[1]);
    char *followersJson = readFile(argv[2]);

    if (followingJson == NULL || followersJson == NULL) {
        printf("Error reading files.\n");
        return 1;
    }

    /* create hash tables for following and followers */
    SymTable_T followingTable = SymTable_new();
    SymTable_T followersTable = SymTable_new();

    if (followingTable == NULL || followersTable == NULL) {
        printf("Error creating hash tables.\n");
        return 1;
    }

    /* extract and insert usernames into tables */
    extractUsernames(followingJson, followingTable);
    extractUsernames(followersJson, followersTable);

    /* compare 2 tables */
    compareTables(followingTable, followersTable);

    /* free mem */
    SymTable_free(followingTable);
    SymTable_free(followersTable);
    free(followingJson);
    free(followersJson);

    return 0;
}
