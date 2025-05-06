# Models

This directory contains code for models provided by this app.

```typescript
//External API call add into any controller to call the remove services
@get('/weather/{lat}/{lon}')
async getWeatherData(
@param.path.number('lat') lat: number,
@param.path.number('lon') lon: number,
) {
try {
return await this.weatherServiceProvider.getWeather(lat, lon);
} catch (error) {
return ResponseHelper.error(HTTP_STATUS.BAD_REQUEST, error.message);
}
}
```

# Component Model Documentation

## Overview

The Component model represents a component entity with manufacturer part number (mfgPN) and manufacturer name (mfgName) as unique identifiers. This document explains how to implement combined unique key constraints across different database systems.

## Model Definition

### Base Model Structure

```typescript
import {Entity, hasMany, model, property} from '@loopback/repository';
import {RfqLineItems} from './rfq-line-items.model';

@model()
export class Component extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  mfgPN: string;

  @property({
    type: 'string',
    required: true,
  })
  mfgName: string;

  @hasMany(() => RfqLineItems)
  rfqLineItems: RfqLineItems[];
}
```

## Unique Key Implementation

### MySQL Implementation

```typescript
@model({
  settings: {
    indexes: {
      unique_mfgPN_mfgName: {
        keys: ['mfgPN', 'mfgName'],
        options: {unique: true},
      },
    },
  },
})
export class Component extends Entity {
  // ... rest of the model definition
}
```

### PostgreSQL Implementation

```typescript
@model({
  settings: {
    postgresql: {
      indexes: {
        unique_mfgPN_mfgName: {
          keys: ['mfgPN', 'mfgName'],
          options: {unique: true},
        },
      },
    },
  },
})
export class Component extends Entity {
  // ... rest of the model definition
}
```

### MongoDB Implementation

```typescript
@model({
  settings: {
    indexes: {
      unique_mfgPN_mfgName: {
        keys: {mfgPN: 1, mfgName: 1},
        options: {unique: true},
      },
    },
  },
})
export class Component extends Entity {
  // ... rest of the model definition
}
```

## Property Validation

For enhanced data integrity, consider adding property-level validations:

```typescript
@property({
  type: 'string',
  required: true,
  jsonSchema: {
    maxLength: 100
  }
})
mfgPN: string;

@property({
  type: 'string',
  required: true,
  jsonSchema: {
    maxLength: 100
  }
})
mfgName: string;
```

## Relationships

The Component model has a one-to-many relationship with RfqLineItems:

```typescript
@hasMany(() => RfqLineItems)
rfqLineItems: RfqLineItems[];
```

## Migration Notes

### MySQL

```typescript
await app.migrateSchema({
  existingSchema: 'drop',
  models: ['Component'],
});
```

### PostgreSQL

```typescript
await app.migrateSchema({
  existingSchema: 'alter',
  models: ['Component'],
});
```

### MongoDB

```typescript
await db
  .collection('Component')
  .createIndex({mfgPN: 1, mfgName: 1}, {unique: true});
```

## Error Handling

Implement error handling for duplicate key violations in your repository:

```typescript
try {
  await this.componentRepository.create(component);
} catch (error) {
  if (
    error.code === 'ER_DUP_ENTRY' ||
    error.code === '23505' ||
    error.code === 11000
  ) {
    throw new HttpErrors.Conflict(
      'Component with this manufacturer part number and name already exists',
    );
  }
  throw error;
}
```
