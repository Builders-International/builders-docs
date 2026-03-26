# Best Practices

## Introduction

This document outlines language-specific and general best practices for writing high-quality code at Builders International. These practices help us write code that is maintainable, secure, performant, and joyful to work with.

## General Principles

### YAGNI - You Aren't Gonna Need It

Don't build features or abstractions you don't need today:

```typescript
// ❌ Over-engineering for future requirements
interface DataStore {
  get(key: string): Promise<any>;
  set(key: string, value: any): Promise<void>;
  delete(key: string): Promise<void>;
  transaction(callback: () => void): Promise<void>;
}

class RedisStore implements DataStore { /* ... */ }
class MongoStore implements DataStore { /* ... */ }
class MemoryStore implements DataStore { /* ... */ }

// Current requirement: store in memory
const store: DataStore = new MemoryStore();

// ✅ Build what you need today
const store = new Map<string, any>();
```

Build abstractions when you have 2-3 concrete examples, not before.

### DRY - Don't Repeat Yourself (But Don't Overdo It)

Eliminate duplication, but not at the cost of clarity:

```typescript
// ❌ Too DRY: Hard to understand
function v(d: any, r: any[]): boolean {
  return r.every(fn => fn(d));
}

// ❌ Too WET: Duplication
function validateEmail(email: string): boolean {
  if (!email) return false;
  if (!email.includes('@')) return false;
  if (!email.includes('.')) return false;
  return true;
}

function validateUsername(username: string): boolean {
  if (!username) return false;
  if (username.length < 3) return false;
  if (username.length > 20) return false;
  return true;
}

// ✅ Just right: Clear and DRY
function validateField(value: string, rules: ValidationRule[]): boolean {
  return rules.every(rule => rule.validate(value));
}

const emailRules = [
  required(),
  contains('@'),
  contains('.'),
];

const usernameRules = [
  required(),
  minLength(3),
  maxLength(20),
];
```

Duplication is better than the wrong abstraction.

### KISS - Keep It Simple, Stupid

Simple code is maintainable code:

```typescript
// ❌ Complex: Clever but hard to understand
const sum = arr.reduce((a, b) => a + b, 0);
const avg = sum / arr.length || 0;
const variance = arr.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / arr.length;
const stdDev = Math.sqrt(variance);

// ✅ Simple: Clear step-by-step
function calculateStandardDeviation(numbers: number[]): number {
  if (numbers.length === 0) return 0;

  const sum = numbers.reduce((total, num) => total + num, 0);
  const average = sum / numbers.length;

  const squaredDifferences = numbers.map(num => Math.pow(num - average, 2));
  const variance = squaredDifferences.reduce((sum, diff) => sum + diff, 0) / numbers.length;

  return Math.sqrt(variance);
}
```

### Clear Over Clever

Code is read far more than written. Optimize for reading:

```typescript
// ❌ Clever: Hard to understand
const u = d.filter(x => x.s === 'a').map(x => ({ n: x.n, e: x.e }));

// ✅ Clear: Self-documenting
const activeUsers = users
  .filter(user => user.status === 'active')
  .map(user => ({
    name: user.name,
    email: user.email,
  }));
```

If you need comments to explain what code does, the code isn't clear enough.

### Composition Over Inheritance

Prefer composition for flexibility:

```typescript
// ❌ Inheritance: Rigid hierarchy
class Animal {
  eat() { /* ... */ }
}

class Bird extends Animal {
  fly() { /* ... */ }
}

class Penguin extends Bird {
  fly() {
    throw new Error('Penguins cannot fly'); // Broken abstraction
  }
}

// ✅ Composition: Flexible and explicit
interface CanEat {
  eat(): void;
}

interface CanFly {
  fly(): void;
}

class Penguin implements CanEat {
  eat() { /* ... */ }
  // No fly method - penguins don't fly
}

class Sparrow implements CanEat, CanFly {
  eat() { /* ... */ }
  fly() { /* ... */ }
}
```

## JavaScript/TypeScript Best Practices

### Use TypeScript for All New Code

TypeScript catches errors before runtime:

```typescript
// ❌ JavaScript: Errors caught at runtime
function calculateDiscount(price, percentage) {
  return price * (percentage / 100);
}

calculateDiscount(100, '20%'); // NaN - runtime error

// ✅ TypeScript: Errors caught at compile time
function calculateDiscount(price: number, percentage: number): number {
  return price * (percentage / 100);
}

calculateDiscount(100, '20%'); // Compile error: string not assignable to number
```

### TypeScript Configuration

Use strict mode for maximum safety:

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

### Avoid `any` Type

`any` defeats TypeScript's purpose:

```typescript
// ❌ any: No type safety
function processData(data: any) {
  return data.map(item => item.value); // No autocomplete, no error checking
}

// ✅ Generic: Type-safe and flexible
function processData<T extends { value: number }>(data: T[]): number[] {
  return data.map(item => item.value);
}

// ✅ unknown: Safe alternative to any
function parseJSON(json: string): unknown {
  return JSON.parse(json);
}

const data = parseJSON('{"name": "John"}');
// Must narrow type before use
if (typeof data === 'object' && data !== null && 'name' in data) {
  console.log(data.name); // Type-safe
}
```

### Prefer `const` Over `let`, Never `var`

Use the most restrictive declaration:

```typescript
// ❌ var: Function-scoped, can be redeclared
var count = 0;
var count = 1; // No error
if (true) {
  var count = 2;
}
console.log(count); // 2 (unexpected)

// ❌ let: Unnecessarily mutable
let userName = 'John';
// userName never reassigned

// ✅ const: Immutable binding
const userName = 'John';
const users = []; // Reference is const, array can still be mutated
users.push('Alice'); // OK
```

### Async/Await Over Promise Chains

Async/await is more readable:

```typescript
// ❌ Promise chains: Harder to read
function getUser(id: string): Promise<User> {
  return fetchUser(id)
    .then(user => validateUser(user))
    .then(validUser => enrichUser(validUser))
    .then(enrichedUser => cacheUser(enrichedUser))
    .catch(error => {
      logger.error('Failed to get user', error);
      throw error;
    });
}

// ✅ Async/await: Clear flow
async function getUser(id: string): Promise<User> {
  try {
    const user = await fetchUser(id);
    const validUser = await validateUser(user);
    const enrichedUser = await enrichUser(validUser);
    await cacheUser(enrichedUser);
    return enrichedUser;
  } catch (error) {
    logger.error('Failed to get user', error);
    throw error;
  }
}
```

### Functional Programming Patterns

Prefer pure functions and immutability:

```typescript
// ❌ Mutation: Hard to track changes
function addItem(cart: Cart, item: Item): void {
  cart.items.push(item);
  cart.total += item.price;
}

// ✅ Immutable: Predictable and testable
function addItem(cart: Cart, item: Item): Cart {
  return {
    ...cart,
    items: [...cart.items, item],
    total: cart.total + item.price,
  };
}

// ❌ Impure: Side effects
let total = 0;
function addToTotal(amount: number): number {
  total += amount; // Modifies external state
  return total;
}

// ✅ Pure: No side effects
function calculateTotal(currentTotal: number, amount: number): number {
  return currentTotal + amount;
}
```

### ESLint and Prettier Configuration

Enforce consistent style:

```json
// .eslintrc.json
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "prettier"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "project": "./tsconfig.json"
  },
  "rules": {
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/explicit-function-return-type": "warn",
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "no-console": ["warn", { "allow": ["warn", "error"] }],
    "prefer-const": "error",
    "no-var": "error"
  }
}
```

```json
// .prettierrc
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "arrowParens": "always"
}
```

### React Best Practices

Use modern React patterns:

```typescript
// ❌ Class component with unnecessary state
class UserProfile extends React.Component<Props, State> {
  state = { user: null, loading: true };

  componentDidMount() {
    this.fetchUser();
  }

  async fetchUser() {
    const user = await api.getUser(this.props.userId);
    this.setState({ user, loading: false });
  }

  render() {
    if (this.state.loading) return <Loading />;
    return <div>{this.state.user.name}</div>;
  }
}

// ✅ Functional component with hooks
function UserProfile({ userId }: Props) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      const user = await api.getUser(userId);
      setUser(user);
      setLoading(false);
    }
    fetchUser();
  }, [userId]);

  if (loading) return <Loading />;
  return <div>{user?.name}</div>;
}

// ✅ Even better: Custom hook
function useUser(userId: string) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchUser() {
      try {
        const user = await api.getUser(userId);
        if (!cancelled) {
          setUser(user);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err as Error);
          setLoading(false);
        }
      }
    }

    fetchUser();

    return () => {
      cancelled = true; // Prevent state updates after unmount
    };
  }, [userId]);

  return { user, loading, error };
}

function UserProfile({ userId }: Props) {
  const { user, loading, error } = useUser(userId);

  if (loading) return <Loading />;
  if (error) return <Error message={error.message} />;
  return <div>{user?.name}</div>;
}
```

## Python Best Practices

### Follow PEP 8

Python's style guide is the standard:

```python
# ❌ PEP 8 violations
def calculateTotal(price,tax_rate):
    total=price+price*tax_rate
    return total

# ✅ PEP 8 compliant
def calculate_total(price: float, tax_rate: float) -> float:
    total = price + price * tax_rate
    return total
```

Key PEP 8 rules:
- 4 spaces for indentation (never tabs)
- Maximum line length: 79 characters (88 with Black)
- snake_case for functions and variables
- PascalCase for classes
- UPPER_SNAKE_CASE for constants
- Two blank lines between top-level definitions
- One blank line between method definitions

### Type Hints

Use type hints for better IDE support and documentation:

```python
# ❌ No type hints
def create_user(name, email, age):
    return {
        'name': name,
        'email': email,
        'age': age,
    }

# ✅ Type hints
from typing import TypedDict

class User(TypedDict):
    name: str
    email: str
    age: int

def create_user(name: str, email: str, age: int) -> User:
    return {
        'name': name,
        'email': email,
        'age': age,
    }

# ✅ Advanced type hints
from typing import Optional, List, Dict, Union

def find_users(
    ids: List[str],
    include_inactive: bool = False
) -> Dict[str, Optional[User]]:
    """Find multiple users by ID."""
    results: Dict[str, Optional[User]] = {}
    for user_id in ids:
        user = db.find_user(user_id, include_inactive)
        results[user_id] = user
    return results
```

### Virtual Environments

Always use virtual environments:

```bash
# Create virtual environment
python -m venv venv

# Activate (Unix/macOS)
source venv/bin/activate

# Activate (Windows)
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Save dependencies
pip freeze > requirements.txt
```

### Dependency Management

Use `requirements.txt` for production and `requirements-dev.txt` for development:

```text
# requirements.txt (production)
fastapi==0.104.1
pydantic==2.5.0
sqlalchemy==2.0.23
psycopg2-binary==2.9.9

# requirements-dev.txt (development)
-r requirements.txt
pytest==7.4.3
pytest-cov==4.1.0
black==23.11.0
pylint==3.0.2
mypy==1.7.1
```

### Black for Formatting

Use Black for consistent formatting:

```python
# Before Black
def very_long_function_name(parameter_one,parameter_two,parameter_three,parameter_four,parameter_five):
    if parameter_one and parameter_two and parameter_three: return parameter_four+parameter_five

# After Black
def very_long_function_name(
    parameter_one,
    parameter_two,
    parameter_three,
    parameter_four,
    parameter_five,
):
    if parameter_one and parameter_two and parameter_three:
        return parameter_four + parameter_five
```

```toml
# pyproject.toml
[tool.black]
line-length = 88
target-version = ['py311']
include = '\.pyi?$'
```

### Pylint/Flake8 for Linting

Catch code quality issues:

```ini
# .pylintrc
[MASTER]
max-line-length=88
disable=C0111  # Missing docstring

[MESSAGES CONTROL]
disable=
    too-few-public-methods,
    too-many-arguments

[BASIC]
good-names=i,j,k,ex,_,id,db
```

### Python Best Practices Examples

```python
# ✅ Context managers for resource management
with open('data.txt', 'r') as file:
    data = file.read()
# File automatically closed

# ✅ List comprehensions for transformations
active_users = [user for user in users if user.is_active]
user_names = [user.name for user in users]

# ✅ Generators for large datasets
def read_large_file(file_path: str):
    """Read file line by line without loading entire file."""
    with open(file_path, 'r') as file:
        for line in file:
            yield line.strip()

# ✅ Dataclasses for data structures
from dataclasses import dataclass

@dataclass
class User:
    id: str
    name: str
    email: str
    is_active: bool = True

# ✅ Enum for constants
from enum import Enum

class UserRole(Enum):
    ADMIN = 'admin'
    USER = 'user'
    GUEST = 'guest'

# ✅ Exception handling
class UserNotFoundError(Exception):
    """Raised when user cannot be found."""
    pass

def get_user(user_id: str) -> User:
    try:
        user = db.find(user_id)
        if not user:
            raise UserNotFoundError(f"User {user_id} not found")
        return user
    except DatabaseError as e:
        logger.error(f"Database error fetching user {user_id}", exc_info=e)
        raise

# ✅ Pathlib for file operations
from pathlib import Path

config_file = Path('config.json')
if config_file.exists():
    data = config_file.read_text()
```

## Go Best Practices

### Use gofmt

Go's formatter is the standard:

```bash
# Format all Go files
gofmt -w .

# Or use goimports (formats + manages imports)
goimports -w .
```

All Go code should be formatted with `gofmt`. No exceptions.

### golangci-lint

Comprehensive linting:

```yaml
# .golangci.yml
linters:
  enable:
    - gofmt
    - golint
    - govet
    - errcheck
    - staticcheck
    - gosimple
    - ineffassign
    - misspell
    - unconvert
    - unparam

linters-settings:
  errcheck:
    check-type-assertions: true
    check-blank: true

run:
  timeout: 5m
```

### Error Handling

Never ignore errors:

```go
// ❌ Ignoring errors
file, _ := os.Open("data.txt")
data, _ := io.ReadAll(file)

// ✅ Proper error handling
file, err := os.Open("data.txt")
if err != nil {
    return fmt.Errorf("failed to open file: %w", err)
}
defer file.Close()

data, err := io.ReadAll(file)
if err != nil {
    return fmt.Errorf("failed to read file: %w", err)
}
```

Always wrap errors with context:

```go
// ❌ Losing error context
func GetUser(id string) (*User, error) {
    user, err := db.FindUser(id)
    if err != nil {
        return nil, err // Lost context about what operation failed
    }
    return user, nil
}

// ✅ Preserving error context
func GetUser(id string) (*User, error) {
    user, err := db.FindUser(id)
    if err != nil {
        return nil, fmt.Errorf("get user %s: %w", id, err)
    }
    return user, nil
}
```

### Context for Cancellation

Use context for cancellation and timeouts:

```go
// ✅ Context with timeout
func FetchData(ctx context.Context, url string) ([]byte, error) {
    req, err := http.NewRequestWithContext(ctx, "GET", url, nil)
    if err != nil {
        return nil, fmt.Errorf("create request: %w", err)
    }

    resp, err := http.DefaultClient.Do(req)
    if err != nil {
        return nil, fmt.Errorf("execute request: %w", err)
    }
    defer resp.Body.Close()

    data, err := io.ReadAll(resp.Body)
    if err != nil {
        return nil, fmt.Errorf("read response: %w", err)
    }

    return data, nil
}

// Usage with timeout
ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
defer cancel()

data, err := FetchData(ctx, "https://api.example.com/data")
if err != nil {
    log.Printf("Failed to fetch data: %v", err)
}
```

### Interface-Based Design

Accept interfaces, return structs:

```go
// ❌ Depending on concrete types
func ProcessUsers(db *PostgresDB) error {
    users, err := db.GetUsers()
    // ...
}

// ✅ Depending on interfaces
type UserRepository interface {
    GetUsers() ([]User, error)
    SaveUser(user User) error
}

func ProcessUsers(repo UserRepository) error {
    users, err := repo.GetUsers()
    // Works with any implementation: PostgresDB, MongoDB, MockDB
    // ...
}
```

Keep interfaces small:

```go
// ❌ Large interface (violates Interface Segregation Principle)
type DataStore interface {
    Get(key string) (interface{}, error)
    Set(key string, value interface{}) error
    Delete(key string) error
    List() ([]string, error)
    Transaction(fn func() error) error
    Backup() error
    Restore() error
}

// ✅ Small, focused interfaces
type Reader interface {
    Get(key string) (interface{}, error)
}

type Writer interface {
    Set(key string, value interface{}) error
    Delete(key string) error
}

type ReadWriter interface {
    Reader
    Writer
}
```

### Go Best Practices Examples

```go
// ✅ Defer for cleanup
func ProcessFile(filename string) error {
    file, err := os.Open(filename)
    if err != nil {
        return err
    }
    defer file.Close() // Guaranteed to run

    // Process file...
    return nil
}

// ✅ Channels for communication
func ProcessItems(items []Item) <-chan Result {
    results := make(chan Result)

    go func() {
        defer close(results)
        for _, item := range items {
            result := process(item)
            results <- result
        }
    }()

    return results
}

// ✅ Struct embedding for composition
type Base struct {
    ID   string
    Name string
}

type User struct {
    Base
    Email string
}

// User automatically has ID and Name fields

// ✅ Table-driven tests
func TestIsValidEmail(t *testing.T) {
    tests := []struct {
        name  string
        email string
        want  bool
    }{
        {"valid email", "user@example.com", true},
        {"missing @", "userexample.com", false},
        {"missing domain", "user@", false},
        {"empty", "", false},
    }

    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            got := IsValidEmail(tt.email)
            if got != tt.want {
                t.Errorf("IsValidEmail(%q) = %v, want %v", tt.email, got, tt.want)
            }
        })
    }
}
```

## Naming Conventions

### Functions and Methods

Use verbs that describe actions:

```typescript
// ✅ Good function names
getUserById(id: string)
calculateTotal(items: Item[])
sendEmail(to: string, subject: string)
validateInput(data: unknown)
transformData(input: Data)
```

### Variables

Use descriptive nouns:

```typescript
// ❌ Unclear names
const d = new Date();
const u = await getUser();
const temp = calculatePrice();

// ✅ Clear names
const currentDate = new Date();
const authenticatedUser = await getUser();
const totalPrice = calculatePrice();
```

### Booleans

Use `is`, `has`, `can`, `should`:

```typescript
// ✅ Boolean naming
const isActive = user.status === 'active';
const hasPermission = checkPermission(user, 'admin');
const canEdit = isOwner || isAdmin;
const shouldSendEmail = user.emailEnabled && !user.unsubscribed;
```

### Constants

Use UPPER_SNAKE_CASE:

```typescript
// ✅ Constants
const MAX_RETRY_ATTEMPTS = 3;
const DEFAULT_TIMEOUT_MS = 5000;
const API_BASE_URL = 'https://api.example.com';
```

### Classes

Use PascalCase nouns:

```typescript
// ✅ Class names
class UserService {}
class EmailValidator {}
class PaymentProcessor {}
class DatabaseConnection {}
```

## Error Handling

### Always Handle Errors

Never silently fail:

```typescript
// ❌ Ignoring errors
async function fetchData() {
  try {
    const data = await api.getData();
    return data;
  } catch (error) {
    // Silent failure - bad!
  }
}

// ✅ Proper error handling
async function fetchData() {
  try {
    const data = await api.getData();
    return data;
  } catch (error) {
    logger.error('Failed to fetch data', { error });
    throw new Error('Unable to fetch data. Please try again later.');
  }
}
```

### Provide Context in Errors

```typescript
// ❌ Generic error
throw new Error('Invalid input');

// ✅ Specific error with context
throw new Error(`Invalid email format: ${email}`);

// ✅ Custom error types
class ValidationError extends Error {
  constructor(
    message: string,
    public field: string,
    public value: unknown
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

throw new ValidationError('Invalid email format', 'email', email);
```

### Use Custom Error Types

```typescript
// ✅ Error hierarchy
class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public isOperational: boolean = true
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

class NotFoundError extends AppError {
  constructor(resource: string, id: string) {
    super(`${resource} with ID ${id} not found`, 404);
  }
}

class ValidationError extends AppError {
  constructor(message: string, public errors: Record<string, string>) {
    super(message, 400);
  }
}

class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(message, 401);
  }
}
```

### Don't Expose Internal Errors

```typescript
// ❌ Exposing internal details
app.use((err, req, res, next) => {
  res.status(500).json({
    error: err.message, // Might expose database structure, file paths, etc.
    stack: err.stack,   // Never expose stack traces to users
  });
});

// ✅ Safe error responses
app.use((err, req, res, next) => {
  logger.error('Request failed', { error: err, req });

  if (err instanceof AppError && err.isOperational) {
    return res.status(err.statusCode).json({
      error: err.message,
    });
  }

  // Unknown errors get generic message
  res.status(500).json({
    error: 'An unexpected error occurred. Please try again later.',
  });
});
```

## Logging Best Practices

### Use Structured Logging

```typescript
// ❌ String logging
console.log('User logged in: ' + userId + ' at ' + new Date());

// ✅ Structured logging
logger.info('User logged in', {
  userId,
  timestamp: new Date().toISOString(),
  ipAddress: req.ip,
});
```

### Log Levels

Use appropriate log levels:

```typescript
// DEBUG: Detailed information for debugging
logger.debug('Fetching user from cache', { userId, cacheKey });

// INFO: General informational messages
logger.info('User logged in', { userId });

// WARN: Warning messages (recoverable issues)
logger.warn('API rate limit approaching', { current: 95, limit: 100 });

// ERROR: Error messages (need attention)
logger.error('Failed to send email', { userId, error });
```

### Include Context

```typescript
// ❌ No context
logger.error('Database query failed');

// ✅ Rich context
logger.error('Database query failed', {
  query: 'SELECT * FROM users WHERE id = ?',
  params: [userId],
  error: error.message,
  requestId: req.id,
  userId: req.user?.id,
  duration: Date.now() - startTime,
});
```

### Don't Log Sensitive Data

```typescript
// ❌ Logging sensitive data
logger.info('User created', {
  user: {
    name: user.name,
    email: user.email,
    password: user.password,        // NEVER log passwords
    creditCard: user.creditCard,    // NEVER log PII
    ssn: user.ssn,                  // NEVER log PII
  },
});

// ✅ Safe logging
logger.info('User created', {
  userId: user.id,
  email: hashEmail(user.email),     // Hash or mask PII
});
```

### Sample High-Volume Logs

```typescript
// ✅ Sampled logging
const SAMPLE_RATE = 0.01; // Log 1% of requests

app.use((req, res, next) => {
  if (Math.random() < SAMPLE_RATE) {
    logger.debug('Request details', {
      method: req.method,
      path: req.path,
      headers: req.headers,
    });
  }
  next();
});
```

## Security Best Practices (OWASP Top 10)

### 1. Input Validation

Validate all user input:

```typescript
// ✅ Schema validation
import { z } from 'zod';

const createUserSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  age: z.number().int().min(0).max(150),
  role: z.enum(['user', 'admin']),
});

app.post('/api/users', async (req, res) => {
  try {
    const validatedData = createUserSchema.parse(req.body);
    const user = await createUser(validatedData);
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: 'Invalid input' });
  }
});
```

### 2. Parameterized Queries

Always use parameterized queries:

```typescript
// ❌ SQL injection vulnerability
const userId = req.params.id;
const query = `SELECT * FROM users WHERE id = '${userId}'`;
const user = await db.raw(query);

// ✅ Parameterized query
const userId = req.params.id;
const user = await db.users.findOne({ where: { id: userId } });
```

### 3. Authentication & Authorization

Verify identity and permissions:

```typescript
// ✅ Authentication middleware
async function requireAuth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = await verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// ✅ Authorization check
async function requireRole(role: string) {
  return async (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
}

app.delete('/api/users/:id', requireAuth, requireRole('admin'), deleteUser);
```

### 4. Secure Secrets Management

Never hardcode secrets:

```typescript
// ❌ Hardcoded secrets
const apiKey = 'sk_live_1234567890';

// ✅ Environment variables
const apiKey = process.env.STRIPE_API_KEY;

if (!apiKey) {
  throw new Error('STRIPE_API_KEY environment variable not set');
}

// ✅ Secret manager (production)
import { SecretsManager } from '@aws-sdk/client-secrets-manager';

async function getSecret(secretName: string): Promise<string> {
  const client = new SecretsManager({ region: 'us-east-1' });
  const response = await client.getSecretValue({ SecretId: secretName });
  return response.SecretString!;
}
```

### 5. HTTPS Everywhere

```typescript
// ✅ Force HTTPS in production
app.use((req, res, next) => {
  if (
    req.header('x-forwarded-proto') !== 'https' &&
    process.env.NODE_ENV === 'production'
  ) {
    return res.redirect(`https://${req.header('host')}${req.url}`);
  }
  next();
});
```

### 6. CORS Configuration

```typescript
// ❌ Overly permissive CORS
app.use(cors({ origin: '*' }));

// ✅ Restrictive CORS
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || [],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
```

### 7. Rate Limiting

```typescript
// ✅ Rate limiting
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});

app.use('/api/', limiter);
```

### 8. Security Headers

```typescript
// ✅ Security headers
import helmet from 'helmet';

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"], // Adjust as needed
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
}));
```

## Performance Optimization

### Profile Before Optimizing

Don't guess, measure:

```typescript
// ✅ Performance profiling
console.time('fetchUsers');
const users = await fetchUsers();
console.timeEnd('fetchUsers'); // "fetchUsers: 1234ms"

// ✅ Detailed profiling
const start = performance.now();
const users = await fetchUsers();
const duration = performance.now() - start;
logger.info('Fetch users completed', { duration, count: users.length });
```

### Database Indexing

Add indexes for frequently queried fields:

```sql
-- ✅ Index for faster lookups
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_created_at ON orders(created_at);

-- ✅ Composite index for common query patterns
CREATE INDEX idx_orders_user_status ON orders(user_id, status);
```

### Query Optimization

```typescript
// ❌ N+1 queries
const users = await User.findAll();
for (const user of users) {
  user.orders = await Order.findAll({ where: { userId: user.id } });
}

// ✅ Single query with join
const users = await User.findAll({
  include: [{ model: Order }],
});
```

### Caching Strategies

```typescript
// ✅ In-memory caching
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 600 }); // 10 minute TTL

async function getUser(id: string): Promise<User> {
  const cached = cache.get<User>(id);
  if (cached) {
    return cached;
  }

  const user = await db.users.findById(id);
  cache.set(id, user);
  return user;
}

// ✅ Redis caching
import Redis from 'ioredis';

const redis = new Redis();

async function getUser(id: string): Promise<User> {
  const cached = await redis.get(`user:${id}`);
  if (cached) {
    return JSON.parse(cached);
  }

  const user = await db.users.findById(id);
  await redis.setex(`user:${id}`, 600, JSON.stringify(user));
  return user;
}
```

### Lazy Loading

```typescript
// ✅ Lazy load heavy components
import { lazy, Suspense } from 'react';

const HeavyComponent = lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <HeavyComponent />
    </Suspense>
  );
}
```

### Code Splitting

```typescript
// ✅ Route-based code splitting
import { lazy } from 'react';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Profile = lazy(() => import('./pages/Profile'));
const Settings = lazy(() => import('./pages/Settings'));

// Each route loads only when needed
```

### Image Optimization

```typescript
// ✅ Optimized images
<Image
  src="/photo.jpg"
  alt="Description"
  width={800}
  height={600}
  loading="lazy"
  placeholder="blur"
  quality={80}
/>

// ✅ Modern formats
<picture>
  <source srcset="image.avif" type="image/avif" />
  <source srcset="image.webp" type="image/webp" />
  <img src="image.jpg" alt="Description" />
</picture>
```

## Summary

Best practices at Builders International emphasize:

- **General Principles**: YAGNI, DRY, KISS, clear over clever
- **TypeScript**: Strict mode, no `any`, async/await, functional patterns
- **Python**: PEP 8, type hints, virtual environments, Black/Pylint
- **Go**: gofmt, error handling, context, interfaces
- **Naming**: Descriptive names that reveal intent
- **Error Handling**: Always handle errors, provide context, custom types
- **Logging**: Structured logging, appropriate levels, rich context
- **Security**: Input validation, parameterized queries, secrets management
- **Performance**: Profile first, database optimization, caching, lazy loading

These practices help us write maintainable, secure, and performant code that serves our mission effectively.
