import "reflect-metadata";

import { Argon2Hasher } from "./security/hasher/argon2/argon2.hasher.js";
import { Hasher } from "./security/hasher/index.js";
import { MassRange } from "./utilities/mass-range/mass-range.js";
import { MassUnit } from "./utilities/mass-unit/mass-unit.js";
import { TimeRange } from "./utilities/time-range/time-range.js";
import { TimeUnit } from "./utilities/time-unit/time-unit.js";

// Exprot all the modules from the common package
export { Entity } from "./domain/entity";
export { Repository } from "./persistence/repository";
export { Mapper } from "./persistence/mapper";
export { ValueObject } from "./domain/value-object";
export { Logger } from "./infrastructure/logger";

// Export implementations

// Export Utilities

// Export Application-Specific Modules
export { TimeRange, TimeUnit, MassRange, MassUnit };

// Hashing
export { Hasher, Argon2Hasher };
