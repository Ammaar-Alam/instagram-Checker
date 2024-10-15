/*--------------------------------------------------------------------*/
/* symtablehash.c                                                     */
/* Author: Ammaar Alam                                                */
/*                                                                    */
/* Description:                                                       */
/*   Implementation of SymTable ADT using a hash table.               */
/*   This version uses a hash table with separate chaining to store   */
/*   bindings.                                                        */
/*--------------------------------------------------------------------*/
/*--------------------------------------------------------------------*/
/* symtable.h                                                         */
/* Author: Ammaar Alam                                                */
/*                                                                    */
/* Description:                                                      */
/*   This header file defines the SymTable abstract data type (ADT)   */
/*   and declares all associated functions. The SymTable ADT provides */
/*   an unordered collection of key-value bindings, where each key   */
/*   is a unique string and each value is a void pointer.             */
/*--------------------------------------------------------------------*/

#ifndef HASHTABLE_H
#define HASHTABLE_H

#include <stddef.h>

/* SymTable_T object is an unordered collection of bindings,
   where each binding is a key-value pair */
typedef struct SymTable *SymTable_T;

/* create and return a new SymTable object. Return NULL if
   insufficient memory is available */
SymTable_T SymTable_new(void);

/* free all memory occupied by oSymTable */
void SymTable_free(SymTable_T oSymTable);

/* return the number of bindings in oSymTable */
size_t SymTable_getLength(SymTable_T oSymTable);

/* add a new binding to oSymTable consisting of key pcKey and value
   pvValue. return 1 (TRUE) if the binding is successfully added,
   or 0 (FALSE) if insufficient memory is available or if a binding
   with the given key already exists */
int SymTable_put(SymTable_T oSymTable, const char *pcKey, const void *pvValue);

/* replace the value of the binding with key pcKey in oSymTable with
   pvValue. Return the old value, or NULL if no such binding exists */
void *SymTable_replace(SymTable_T oSymTable, const char *pcKey, const void *pvValue);

/* return 1 (TRUE) if oSymTable contains a binding with key pcKey,
   or 0 (FALSE) otherwise */
int SymTable_contains(SymTable_T oSymTable, const char *pcKey);

/* reutnr the value of the binding with key pcKey in oSymTable,
   or NULL if no such binding exists */
void *SymTable_get(SymTable_T oSymTable, const char *pcKey);

/* remove the binding with key pcKey from oSymTable. Return the
   binding's value, or NULL if no such binding exists */
void *SymTable_remove(SymTable_T oSymTable, const char *pcKey);

/* apply function *pfApply to each binding in oSymTable, passing
   pvExtra as an extra parameter */
void SymTable_map(SymTable_T oSymTable,
                  void (*pfApply)(const char *pcKey, void *pvValue, void *pvExtra),
                  const void *pvExtra);

#endif
