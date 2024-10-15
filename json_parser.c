/*--------------------------------------------------------------------*/
/* json_parser.c                                                      */
/* Author: Ammaar Alam                                                */
/*--------------------------------------------------------------------*/

#include <stdio.h>
#include <string.h>
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
        SymTable_put(table, username, NULL); /* insert into hashtable */
        pos = strstr(pos + 1, "\"value\":"); /* find next occurance  */
    }
}

static void printNonFollowers(const char *username, void *pvValue, void *pvExtra) {
    struct {
        SymTable_T otherTable;
        const char *message;
    } *data = pvExtra;

    if (!SymTable_contains(data->otherTable, username)) {
        printf("%s %s\n", username, data->message);
    }
}

void compareTables(SymTable_T following, SymTable_T followers) {
    struct {
        SymTable_T otherTable;
        const char *message;
    } data;

    printf("People you follow but don't follow you back:\n");
    data.otherTable = followers;
    data.message = "does not follow you back.";
    SymTable_map(following, printNonFollowers, &data);

    printf("\nPeople who follow you but you don't follow back:\n");
    data.otherTable = following;
    data.message = "is not followed by you.";
    SymTable_map(followers, printNonFollowers, &data);
}
