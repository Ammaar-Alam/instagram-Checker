/*--------------------------------------------------------------------*/
/* json_parser.c                                                      */
/* Author: Ammaar Alam                                                */
/*--------------------------------------------------------------------*/

#include <stdio.h>
#include "json_parser.h"
#include "hashtable.h"

char* readFile(const char* filename) {
    FILE *file = fopen(filename, "r");
    if (file == NULL) {
        printf("Error opening file %s.\n", filename);
        return NULL;
    }

    fseek(file, 0, SEEK_END); /* move to end of file */
    long fileSize = ftell(file);  /* gets file size */
    fseek(file, 0, SEEK_SET);  /* go back to beginning of file */

    char *data = malloc(fileSize + 1);  /* allocate space for the file content */
    if (data == NULL) {
        printf("Memory allocation error.\n");
        fclose(file);
        return NULL;
    }

    fread(data, 1, fileSize, file);  /* read file into memory */
    data[fileSize] = '\0';  /* null-terminate the string */

    fclose(file);  /* close file */
    return data;
}

void extractUsernames (const char* jsonData, SymTable_T table) {
    const char *pos = strstr(jsonData, "\"value\":");
    while (pos != NULL) {
        char username[100]; /* buffer to hold username */
        sscanf(pos, "\"value\": \"%[^\"]\"", username); /* extract username */
        SymTable_put(table, username); /* insert into hashtable */
        pos = strstr(pos + 1, "\"value\":"); /* find next occurance  */
    }
}

void compareTables (SymTable_T following, SymTable_T followers) {
    /* find ppl who you follow but dont follow you back */
    for (size_t i = 0; i < SymTable_getLength(following); i++) {
        const char *username = SymTable_get(following, i); /* gets user from following list */
        if (!SymTable_contains(followers, username)) printf("%s does not follow you back.\n", username);
    }

    /* find ppl who follow you but you dont follow back */
    for (size_t i = 0; i < SymTable_getLength(followers); i++) {
        const char *username = SymTable_get(followers, i); /* gets user from following list */
        if (!SymTable_contains(following, username)) printf("%s follows you but you don't follow them back.\n", username);
    }

}
