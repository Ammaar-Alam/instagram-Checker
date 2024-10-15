/*--------------------------------------------------------------------*/
/* main.c                                                             */
/* Author: Ammaar Alam                                                */
/*--------------------------------------------------------------------*/

#include <stdio.h>
#include <stdlib.h>
#include "hashtable.h"
#include "json_parser.h"

int main(void) {
    /* read the JSON files for following and followers */
    char *followingJson = readFile("following.json");
    char *followersJson = readFile("followers.json");

    if (followingJson == NULL || followersJson == NULL) {
        printf("Error reading files.\n");
        return 1;
    }

    /* create hash tables for following and followers */
    SymTable_T followingTable = SymTable_new();
    SymTable_T followersTable = SymTable_new();

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
