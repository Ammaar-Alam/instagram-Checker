/*--------------------------------------------------------------------*/
/* symtablehash.c                                                     */
/* Author: Ammaar Alam                                                */
/*                                                                    */
/* Description:                                                       */
/*   Implementation of SymTable ADT using a hash table.               */
/*   This version uses a hash table with separate chaining to store   */
/*   bindings.                                                        */
/*--------------------------------------------------------------------*/

#include "hashtable.h"
#include <assert.h>
#include <string.h>
#include <stdlib.h>

/* key/value pair in symtable */
struct Binding {
    /* binding key */
    char *pcKey;
    /* key value; can be NULL */
    const void *pvValue;
    /* pointer to next binding in chain */
    struct Binding *psNext;
};

/* the symtable (implemented as hash table) */
struct SymTable {
    /* number of bindings in table */
    size_t uLength;
    /* number of buckets in table */
    size_t uBucketCount;
    /* pointer array to first binding in each bucket */
    struct Binding **ppsBuckets;
};

/* given sequence of bucket counts by assingment */
static const size_t aBucketCounts[] = {509, 1021, 2039, 4093, 8191, 16381, 32749, 65521};

/* number of bucket counts in sequence */
#define BUCKET_COUNT_SIZE (sizeof(aBucketCounts)/sizeof(aBucketCounts[0]))

/* return a hash code for pcKey that is between 0 and uBucketCount-1 */
static size_t SymTable_hash(const char *pcKey, size_t uBucketCount) {
    const size_t HASH_MULTIPLIER = 65599;
    size_t u;
    size_t uHash = 0;

    assert(pcKey != NULL);

    for (u = 0; pcKey[u] != '\0'; u++)
        uHash = uHash * HASH_MULTIPLIER + (size_t)pcKey[u];

    return uHash % uBucketCount;
}

/* expand the hash table oSymTable to the next bucket count
   return 1 (TRUE) if succesful, or 0 (FALSE) if insufficient memory is available
   if the bucket count cannot be increased further, return 1 (TRUE) */
static int SymTable_expand(SymTable_T oSymTable) {
    size_t uNewBucketCount, uOldBucketCount, i, uHash;
    struct Binding **ppsNewBuckets = NULL;
    struct Binding *psBinding, *psNextBinding;

    assert(oSymTable != NULL);

    /* find next bucket count */
    for (i = 0; i < BUCKET_COUNT_SIZE; i++) {
        if (aBucketCounts[i] == oSymTable->uBucketCount)
            break;
    }

    if (i + 1 >= BUCKET_COUNT_SIZE)
        return 1;

    uNewBucketCount = aBucketCounts[i + 1];
    ppsNewBuckets = (struct Binding **)malloc(uNewBucketCount * sizeof(struct Binding *));
    if (ppsNewBuckets == NULL)
        return 0;

    /* set new buckets to NULL */
    for (i = 0; i < uNewBucketCount; i++)
        ppsNewBuckets[i] = NULL;

    /* rehash all previous bindings into new buckets */
    uOldBucketCount = oSymTable->uBucketCount;

    for (i = 0; i < uOldBucketCount; i++) {
        for (psBinding = oSymTable->ppsBuckets[i]; psBinding != NULL; psBinding = psNextBinding) {
            psNextBinding = psBinding->psNext;

            uHash = SymTable_hash(psBinding->pcKey, uNewBucketCount);
            assert(uHash < uNewBucketCount);

            psBinding->psNext = ppsNewBuckets[uHash];
            ppsNewBuckets[uHash] = psBinding;
        }
    }

    /* free old buckets array */
    free(oSymTable->ppsBuckets);

    /* update symtable */
    oSymTable->ppsBuckets = ppsNewBuckets;
    oSymTable->uBucketCount = uNewBucketCount;

    return 1;
}

SymTable_T SymTable_new(void) {
    SymTable_T oSymTable;
    size_t i;

    oSymTable = (SymTable_T)malloc(sizeof(struct SymTable));
    if (oSymTable == NULL)
        return NULL;

    oSymTable->uLength = 0;
    oSymTable->uBucketCount = aBucketCounts[0]; /* initial bucket count is 509 */
    oSymTable->ppsBuckets = (struct Binding **)malloc(oSymTable->uBucketCount * sizeof(struct Binding *));
    if (oSymTable->ppsBuckets == NULL) {
        free(oSymTable);
        return NULL;
    }

    /* set all buckets to NULL */
    for (i = 0; i < oSymTable->uBucketCount; i++)
        oSymTable->ppsBuckets[i] = NULL;

    return oSymTable;
}

void SymTable_free(SymTable_T oSymTable) {
    size_t i;
    struct Binding *psBinding, *psNextBinding;
    assert(oSymTable != NULL);

    for (i = 0; i < oSymTable->uBucketCount; i++) {
        for (psBinding = oSymTable->ppsBuckets[i]; psBinding != NULL; psBinding = psNextBinding) {
            psNextBinding = psBinding->psNext;
            free(psBinding->pcKey);
            free(psBinding);
        }
    }

    free(oSymTable->ppsBuckets);
    free(oSymTable);
}

size_t SymTable_getLength(SymTable_T oSymTable) {
    assert(oSymTable != NULL);
    return oSymTable->uLength;
}

int SymTable_put(SymTable_T oSymTable, const char *pcKey, const void *pvValue) {
    struct Binding *psNewBinding;
    size_t uHash;
    struct Binding *psBinding;
    assert(oSymTable != NULL);
    assert(pcKey != NULL);
    /* pvValue can be NULL, so no assert */

    uHash = SymTable_hash(pcKey, oSymTable->uBucketCount);

    /* check if key already exists */
    for (psBinding = oSymTable->ppsBuckets[uHash]; psBinding != NULL; psBinding = psBinding->psNext) {
        if (strcmp(psBinding->pcKey, pcKey) == 0)
            return 0;
    }

    /* this is the block of code that will get commented out to
        make the hashtable non-expanding */
    if (oSymTable->uLength >= oSymTable->uBucketCount) {
        if (!SymTable_expand(oSymTable)) {
            /* expansion failed ->  insufficient memory */
            /* proceed w/o expanding */
        }
        /* recompute hash since bucket count changed */
        uHash = SymTable_hash(pcKey, oSymTable->uBucketCount);
     }

    psNewBinding = (struct Binding*)malloc(sizeof(struct Binding));
    if (psNewBinding == NULL)
        return 0;

    psNewBinding->pcKey = (char*)malloc(strlen(pcKey) + 1);
    if (psNewBinding->pcKey == NULL) {
        free(psNewBinding);
        return 0;
    }

    strcpy(psNewBinding->pcKey, pcKey);
    psNewBinding->pvValue = pvValue;

    /* insert new binding into bucket's list */
    psNewBinding->psNext = oSymTable->ppsBuckets[uHash];
    oSymTable->ppsBuckets[uHash] = psNewBinding;

    oSymTable->uLength++;

    return 1;
}

void *SymTable_replace(SymTable_T oSymTable, const char *pcKey, const void *pvValue) {
    size_t uHash;
    struct Binding *psBinding;
    void *pvOldValue;

    assert(oSymTable != NULL);
    assert(pcKey != NULL);
    /* pvValue can be NULL, so no assert */

    uHash = SymTable_hash(pcKey, oSymTable->uBucketCount);

    for (psBinding = oSymTable->ppsBuckets[uHash]; psBinding != NULL; psBinding = psBinding->psNext) {
        if (strcmp(psBinding->pcKey, pcKey) == 0) {
            pvOldValue = (void *)psBinding->pvValue;
            psBinding->pvValue = pvValue;
            return pvOldValue;
        }
    }

    return NULL;
}

int SymTable_contains(SymTable_T oSymTable, const char *pcKey) {
    size_t uHash;
    struct Binding *psBinding;

    assert(oSymTable != NULL);
    assert(pcKey != NULL);

    uHash = SymTable_hash(pcKey, oSymTable->uBucketCount);

    for (psBinding = oSymTable->ppsBuckets[uHash]; psBinding != NULL; psBinding = psBinding->psNext) {
        if (strcmp(psBinding->pcKey, pcKey) == 0)
            return 1;
    }

    return 0;
}

void *SymTable_get(SymTable_T oSymTable, const char *pcKey) {
    size_t uHash;
    struct Binding *psBinding;

    assert(oSymTable != NULL);
    assert(pcKey != NULL);

    uHash = SymTable_hash(pcKey, oSymTable->uBucketCount);

    for (psBinding = oSymTable->ppsBuckets[uHash]; psBinding != NULL; psBinding = psBinding->psNext) {
        if (strcmp(psBinding->pcKey, pcKey) == 0)
            return (void *)psBinding->pvValue;
    }

    return NULL;
}

void *SymTable_remove(SymTable_T oSymTable, const char *pcKey) {
    size_t uHash;
    struct Binding *psBinding, *psPrevBinding = NULL;
    void *pvValue;

    assert(oSymTable != NULL);
    assert(pcKey != NULL);

    uHash = SymTable_hash(pcKey, oSymTable->uBucketCount);

    for (psBinding = oSymTable->ppsBuckets[uHash]; psBinding != NULL;
         psPrevBinding = psBinding, psBinding = psBinding->psNext) {
        if (strcmp(psBinding->pcKey, pcKey) == 0) {
            if (psPrevBinding == NULL)
                oSymTable->ppsBuckets[uHash] = psBinding->psNext;
            else
                psPrevBinding->psNext = psBinding->psNext;
            pvValue = (void *)psBinding->pvValue;
            free(psBinding->pcKey);
            free(psBinding);
            oSymTable->uLength--;
            return pvValue;
        }
    }

    return NULL;
}

void SymTable_map(SymTable_T oSymTable,
                  void (*pfApply)(const char *pcKey, void *pvValue, void *pvExtra),
                  const void *pvExtra) {
    size_t i;
    struct Binding *psBinding;
    assert(oSymTable != NULL);
    assert(pfApply != NULL);
    /* pvExtra can be NULL, so no assert */

    for (i = 0; i < oSymTable->uBucketCount; i++) {
        for (psBinding = oSymTable->ppsBuckets[i]; psBinding != NULL; psBinding = psBinding->psNext) {
            (*pfApply)(psBinding->pcKey, (void *)psBinding->pvValue, (void *)pvExtra);
        }
    }
}
