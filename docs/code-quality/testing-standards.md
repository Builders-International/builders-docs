# Testing Standards

## Introduction

Testing is not optional at Builders International. Comprehensive tests are the foundation of maintainable, reliable software. This document outlines our testing philosophy, requirements, and best practices.

## Testing Philosophy

### Why We Test

Tests provide multiple benefits:

- **Confidence**: Deploy without fear of breaking existing functionality
- **Documentation**: Tests show how code is intended to be used
- **Design Feedback**: Hard-to-test code is often poorly designed
- **Regression Prevention**: Catch bugs before they reach production
- **Refactoring Safety**: Improve code structure without breaking behavior
- **Faster Development**: Find bugs in seconds, not hours or days

### Test-Driven Development (TDD)

We practice TDD for new features:

1. **Red**: Write a failing test that defines desired behavior
2. **Green**: Write minimal code to make the test pass
3. **Refactor**: Improve the code while keeping tests green

Benefits of TDD:

- Better API design (you use the API before implementing it)
- Complete test coverage (every line has a test)
- Faster feedback (immediate validation of changes)
- Fewer bugs (tests written first tend to be more thorough)

### Testing Pyramid

We follow the testing pyramid model:

```
         /\
        /  \  E2E Tests (Few)
       /    \
      /------\
     / Integr \  Integration Tests (Some)
    /  -ation  \
   /------------\
  /    Unit      \  Unit Tests (Many)
 /     Tests      \
/------------------\
```

- **Unit Tests (70-80%)**: Fast, isolated, test individual functions/methods
- **Integration Tests (15-25%)**: Test component interactions, database, APIs
- **E2E Tests (5-10%)**: Test complete user workflows through the UI

## Coverage Requirements

### Minimum Standards

- **Overall Coverage**: Minimum 80%, target 90%+
- **New Code**: 100% coverage required for new features
- **Critical Paths**: 100% coverage for authentication, payment, data integrity
- **Bug Fixes**: Every bug fix must include a regression test

### Coverage Reporting

All projects must report coverage in CI:

```yaml
# .github/workflows/test.yml
- name: Run tests with coverage
  run: npm test -- --coverage --coverageThreshold='{"global":{"branches":80,"functions":80,"lines":80,"statements":80}}'

- name: Upload coverage to Codecov
  uses: codecov/codecov-action@v3
  with:
    files: ./coverage/lcov.info
    flags: unittests
    fail_ci_if_error: true
```

### What Coverage Doesn't Mean

High coverage doesn't guarantee quality:

- **Coverage ≠ Good Tests**: 100% coverage with poor assertions is worthless
- **Coverage ≠ All Scenarios**: Tests might not cover edge cases
- **Coverage ≠ Integration**: Unit coverage doesn't test component interaction

Good coverage is necessary but not sufficient.

## Unit Testing Standards

### General Principles

Unit tests should be:

- **Fast**: Run in milliseconds, total suite under 10 seconds
- **Isolated**: No shared state between tests
- **Deterministic**: Same input always produces same output
- **Focused**: Test one behavior per test
- **Clear**: Test name describes what's being tested

### Test Organization

#### Co-location with Code

Tests live alongside the code they test:

```
src/
  services/
    userService.ts
    userService.test.ts
  utils/
    validation.ts
    validation.test.ts
```

#### Test File Naming

- **JavaScript/TypeScript**: `*.test.ts` or `*.spec.ts`
- **Python**: `test_*.py` or `*_test.py`
- **Go**: `*_test.go`

### Naming Conventions

Test names should be descriptive and follow a pattern:

```typescript
// Pattern: describe("ComponentName", () => { it("should behavior when condition", () => {}) })

describe("UserService", () => {
  it("should create user when valid data provided", () => {
    // Test implementation
  });

  it("should throw error when email is invalid", () => {
    // Test implementation
  });

  it("should hash password before storing", () => {
    // Test implementation
  });
});
```

```python
# Pattern: test_should_behavior_when_condition

def test_should_create_user_when_valid_data_provided():
    # Test implementation
    pass

def test_should_raise_error_when_email_is_invalid():
    # Test implementation
    pass

def test_should_hash_password_before_storing():
    # Test implementation
    pass
```

### Arrange-Act-Assert Pattern

Structure tests clearly:

```typescript
it("should calculate discount correctly for premium members", () => {
  // Arrange: Set up test data and dependencies
  const user = { id: "123", membershipType: "premium" };
  const order = { total: 100, items: [...] };
  const discountService = new DiscountService();

  // Act: Execute the behavior being tested
  const discount = discountService.calculateDiscount(user, order);

  // Assert: Verify the outcome
  expect(discount).toBe(20);
});
```

### JavaScript/TypeScript Testing (Jest)

#### Configuration

```javascript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.test.{ts,tsx}',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  testMatch: ['**/__tests__/**/*.ts', '**/*.test.ts'],
};
```

#### Example Tests

```typescript
// userService.test.ts
import { UserService } from './userService';
import { UserRepository } from './userRepository';

// Mock dependencies
jest.mock('./userRepository');

describe('UserService', () => {
  let userService: UserService;
  let mockUserRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    // Reset mocks before each test
    mockUserRepository = new UserRepository() as jest.Mocked<UserRepository>;
    userService = new UserService(mockUserRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create user when valid data provided', async () => {
      // Arrange
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'SecurePass123!',
      };
      const expectedUser = { id: '123', ...userData };
      mockUserRepository.save.mockResolvedValue(expectedUser);

      // Act
      const result = await userService.createUser(userData);

      // Assert
      expect(result).toEqual(expectedUser);
      expect(mockUserRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          name: userData.name,
          email: userData.email,
        })
      );
      expect(mockUserRepository.save).toHaveBeenCalledTimes(1);
    });

    it('should hash password before storing', async () => {
      // Arrange
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'SecurePass123!',
      };
      mockUserRepository.save.mockResolvedValue({ id: '123', ...userData });

      // Act
      await userService.createUser(userData);

      // Assert
      const savedUser = mockUserRepository.save.mock.calls[0][0];
      expect(savedUser.password).not.toBe(userData.password);
      expect(savedUser.password).toMatch(/^\$2[ayb]\$.{56}$/); // bcrypt hash pattern
    });

    it('should throw error when email is invalid', async () => {
      // Arrange
      const userData = {
        name: 'John Doe',
        email: 'invalid-email',
        password: 'SecurePass123!',
      };

      // Act & Assert
      await expect(userService.createUser(userData)).rejects.toThrow(
        'Invalid email format'
      );
      expect(mockUserRepository.save).not.toHaveBeenCalled();
    });

    it('should throw error when email already exists', async () => {
      // Arrange
      const userData = {
        name: 'John Doe',
        email: 'existing@example.com',
        password: 'SecurePass123!',
      };
      mockUserRepository.findByEmail.mockResolvedValue({ id: '456', email: userData.email });

      // Act & Assert
      await expect(userService.createUser(userData)).rejects.toThrow(
        'Email already registered'
      );
      expect(mockUserRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('getUserById', () => {
    it('should return user when found', async () => {
      // Arrange
      const userId = '123';
      const expectedUser = { id: userId, name: 'John Doe', email: 'john@example.com' };
      mockUserRepository.findById.mockResolvedValue(expectedUser);

      // Act
      const result = await userService.getUserById(userId);

      // Assert
      expect(result).toEqual(expectedUser);
      expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
    });

    it('should return null when user not found', async () => {
      // Arrange
      mockUserRepository.findById.mockResolvedValue(null);

      // Act
      const result = await userService.getUserById('999');

      // Assert
      expect(result).toBeNull();
    });
  });
});
```

### Python Testing (pytest)

#### Configuration

```python
# pytest.ini
[pytest]
testpaths = tests
python_files = test_*.py *_test.py
python_classes = Test*
python_functions = test_*
addopts =
    --cov=src
    --cov-report=html
    --cov-report=term-missing
    --cov-fail-under=80
    -v
```

#### Example Tests

```python
# test_user_service.py
import pytest
from unittest.mock import Mock, patch
from src.services.user_service import UserService
from src.repositories.user_repository import UserRepository
from src.exceptions import ValidationError, DuplicateEmailError


@pytest.fixture
def mock_user_repository():
    """Fixture providing a mocked UserRepository"""
    return Mock(spec=UserRepository)


@pytest.fixture
def user_service(mock_user_repository):
    """Fixture providing a UserService with mocked dependencies"""
    return UserService(repository=mock_user_repository)


class TestUserService:
    """Tests for UserService"""

    def test_should_create_user_when_valid_data_provided(
        self, user_service, mock_user_repository
    ):
        # Arrange
        user_data = {
            "name": "John Doe",
            "email": "john@example.com",
            "password": "SecurePass123!",
        }
        expected_user = {"id": "123", **user_data}
        mock_user_repository.save.return_value = expected_user

        # Act
        result = user_service.create_user(user_data)

        # Assert
        assert result == expected_user
        mock_user_repository.save.assert_called_once()
        saved_user = mock_user_repository.save.call_args[0][0]
        assert saved_user["name"] == user_data["name"]
        assert saved_user["email"] == user_data["email"]

    def test_should_hash_password_before_storing(
        self, user_service, mock_user_repository
    ):
        # Arrange
        user_data = {
            "name": "John Doe",
            "email": "john@example.com",
            "password": "SecurePass123!",
        }
        mock_user_repository.save.return_value = {"id": "123"}

        # Act
        user_service.create_user(user_data)

        # Assert
        saved_user = mock_user_repository.save.call_args[0][0]
        assert saved_user["password"] != user_data["password"]
        assert saved_user["password"].startswith("$2b$")  # bcrypt hash

    def test_should_raise_error_when_email_is_invalid(
        self, user_service, mock_user_repository
    ):
        # Arrange
        user_data = {
            "name": "John Doe",
            "email": "invalid-email",
            "password": "SecurePass123!",
        }

        # Act & Assert
        with pytest.raises(ValidationError, match="Invalid email format"):
            user_service.create_user(user_data)
        mock_user_repository.save.assert_not_called()

    def test_should_raise_error_when_email_already_exists(
        self, user_service, mock_user_repository
    ):
        # Arrange
        user_data = {
            "name": "John Doe",
            "email": "existing@example.com",
            "password": "SecurePass123!",
        }
        mock_user_repository.find_by_email.return_value = {
            "id": "456",
            "email": user_data["email"],
        }

        # Act & Assert
        with pytest.raises(DuplicateEmailError, match="Email already registered"):
            user_service.create_user(user_data)
        mock_user_repository.save.assert_not_called()

    def test_should_return_user_when_found(
        self, user_service, mock_user_repository
    ):
        # Arrange
        user_id = "123"
        expected_user = {
            "id": user_id,
            "name": "John Doe",
            "email": "john@example.com",
        }
        mock_user_repository.find_by_id.return_value = expected_user

        # Act
        result = user_service.get_user_by_id(user_id)

        # Assert
        assert result == expected_user
        mock_user_repository.find_by_id.assert_called_once_with(user_id)

    def test_should_return_none_when_user_not_found(
        self, user_service, mock_user_repository
    ):
        # Arrange
        mock_user_repository.find_by_id.return_value = None

        # Act
        result = user_service.get_user_by_id("999")

        # Assert
        assert result is None


# Parameterized tests for testing multiple scenarios
@pytest.mark.parametrize(
    "email,should_be_valid",
    [
        ("valid@example.com", True),
        ("user+tag@example.co.uk", True),
        ("invalid", False),
        ("@example.com", False),
        ("user@", False),
        ("", False),
    ],
)
def test_email_validation(email, should_be_valid):
    """Test email validation with various inputs"""
    from src.utils.validation import is_valid_email

    assert is_valid_email(email) == should_be_valid
```

### Go Testing (testing package)

#### Example Tests

```go
// user_service_test.go
package services

import (
    "errors"
    "testing"

    "github.com/stretchr/testify/assert"
    "github.com/stretchr/testify/mock"
)

// MockUserRepository is a mock for UserRepository
type MockUserRepository struct {
    mock.Mock
}

func (m *MockUserRepository) Save(user *User) (*User, error) {
    args := m.Called(user)
    if args.Get(0) == nil {
        return nil, args.Error(1)
    }
    return args.Get(0).(*User), args.Error(1)
}

func (m *MockUserRepository) FindByID(id string) (*User, error) {
    args := m.Called(id)
    if args.Get(0) == nil {
        return nil, args.Error(1)
    }
    return args.Get(0).(*User), args.Error(1)
}

func (m *MockUserRepository) FindByEmail(email string) (*User, error) {
    args := m.Called(email)
    if args.Get(0) == nil {
        return nil, args.Error(1)
    }
    return args.Get(0).(*User), args.Error(1)
}

func TestUserService_CreateUser_ValidData(t *testing.T) {
    // Arrange
    mockRepo := new(MockUserRepository)
    service := NewUserService(mockRepo)

    userData := &User{
        Name:     "John Doe",
        Email:    "john@example.com",
        Password: "SecurePass123!",
    }
    expectedUser := &User{
        ID:    "123",
        Name:  "John Doe",
        Email: "john@example.com",
    }

    mockRepo.On("FindByEmail", userData.Email).Return(nil, nil)
    mockRepo.On("Save", mock.AnythingOfType("*User")).Return(expectedUser, nil)

    // Act
    result, err := service.CreateUser(userData)

    // Assert
    assert.NoError(t, err)
    assert.Equal(t, expectedUser, result)
    mockRepo.AssertExpectations(t)
}

func TestUserService_CreateUser_HashesPassword(t *testing.T) {
    // Arrange
    mockRepo := new(MockUserRepository)
    service := NewUserService(mockRepo)

    userData := &User{
        Name:     "John Doe",
        Email:    "john@example.com",
        Password: "SecurePass123!",
    }

    mockRepo.On("FindByEmail", userData.Email).Return(nil, nil)
    mockRepo.On("Save", mock.AnythingOfType("*User")).Return(&User{ID: "123"}, nil)

    // Act
    _, err := service.CreateUser(userData)

    // Assert
    assert.NoError(t, err)

    // Verify password was hashed
    savedUser := mockRepo.Calls[1].Arguments.Get(0).(*User)
    assert.NotEqual(t, userData.Password, savedUser.Password)
    assert.True(t, len(savedUser.Password) > 50) // Hashed passwords are long
}

func TestUserService_CreateUser_InvalidEmail(t *testing.T) {
    // Arrange
    mockRepo := new(MockUserRepository)
    service := NewUserService(mockRepo)

    userData := &User{
        Name:     "John Doe",
        Email:    "invalid-email",
        Password: "SecurePass123!",
    }

    // Act
    result, err := service.CreateUser(userData)

    // Assert
    assert.Error(t, err)
    assert.Nil(t, result)
    assert.Contains(t, err.Error(), "invalid email format")
    mockRepo.AssertNotCalled(t, "Save")
}

func TestUserService_CreateUser_DuplicateEmail(t *testing.T) {
    // Arrange
    mockRepo := new(MockUserRepository)
    service := NewUserService(mockRepo)

    userData := &User{
        Name:     "John Doe",
        Email:    "existing@example.com",
        Password: "SecurePass123!",
    }
    existingUser := &User{ID: "456", Email: userData.Email}

    mockRepo.On("FindByEmail", userData.Email).Return(existingUser, nil)

    // Act
    result, err := service.CreateUser(userData)

    // Assert
    assert.Error(t, err)
    assert.Nil(t, result)
    assert.Contains(t, err.Error(), "email already registered")
    mockRepo.AssertNotCalled(t, "Save")
}

// Table-driven tests
func TestEmailValidation(t *testing.T) {
    tests := []struct {
        name    string
        email   string
        isValid bool
    }{
        {"valid email", "valid@example.com", true},
        {"email with plus", "user+tag@example.co.uk", true},
        {"missing @", "invalid", false},
        {"missing domain", "user@", false},
        {"missing user", "@example.com", false},
        {"empty", "", false},
    }

    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            result := IsValidEmail(tt.email)
            assert.Equal(t, tt.isValid, result)
        })
    }
}
```

## Integration Testing

### What to Test

Integration tests verify component interactions:

- **Database Operations**: CRUD operations with real database
- **API Endpoints**: HTTP requests/responses with real server
- **External Services**: Integration with third-party APIs (mocked or sandboxed)
- **Message Queues**: Publishing/consuming messages
- **File System**: Reading/writing files

### Database Testing

Use test databases that mirror production:

```typescript
// jest.config.integration.js
module.exports = {
  ...require('./jest.config'),
  testMatch: ['**/*.integration.test.ts'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup-integration.ts'],
};
```

```typescript
// tests/setup-integration.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL_TEST,
    },
  },
});

beforeAll(async () => {
  // Run migrations
  await prisma.$executeRawUnsafe('DROP SCHEMA IF EXISTS test CASCADE');
  await prisma.$executeRawUnsafe('CREATE SCHEMA test');
  // Run migrations here
});

beforeEach(async () => {
  // Clean database before each test
  await prisma.user.deleteMany();
  await prisma.project.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});

export { prisma };
```

```typescript
// userService.integration.test.ts
import { prisma } from '../tests/setup-integration';
import { UserService } from './userService';

describe('UserService Integration Tests', () => {
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService(prisma);
  });

  it('should create and retrieve user from database', async () => {
    // Arrange
    const userData = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'SecurePass123!',
    };

    // Act
    const createdUser = await userService.createUser(userData);
    const retrievedUser = await userService.getUserById(createdUser.id);

    // Assert
    expect(retrievedUser).toMatchObject({
      id: createdUser.id,
      name: userData.name,
      email: userData.email,
    });
    expect(retrievedUser.password).not.toBe(userData.password); // Hashed
  });

  it('should prevent duplicate emails', async () => {
    // Arrange
    const userData = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'SecurePass123!',
    };

    // Act
    await userService.createUser(userData);

    // Assert
    await expect(userService.createUser(userData)).rejects.toThrow(
      'Email already registered'
    );
  });
});
```

### API Testing

Test HTTP endpoints with real server:

```typescript
// app.integration.test.ts
import request from 'supertest';
import { app } from '../src/app';
import { prisma } from '../tests/setup-integration';

describe('User API Integration Tests', () => {
  describe('POST /api/users', () => {
    it('should create user and return 201', async () => {
      // Arrange
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'SecurePass123!',
      };

      // Act
      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(201);

      // Assert
      expect(response.body).toMatchObject({
        id: expect.any(String),
        name: userData.name,
        email: userData.email,
      });
      expect(response.body.password).toBeUndefined(); // Never return password

      // Verify in database
      const user = await prisma.user.findUnique({
        where: { id: response.body.id },
      });
      expect(user).toBeTruthy();
    });

    it('should return 400 for invalid email', async () => {
      // Arrange
      const userData = {
        name: 'John Doe',
        email: 'invalid-email',
        password: 'SecurePass123!',
      };

      // Act
      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(400);

      // Assert
      expect(response.body.error).toContain('Invalid email');
    });

    it('should return 409 for duplicate email', async () => {
      // Arrange
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'SecurePass123!',
      };
      await request(app).post('/api/users').send(userData);

      // Act
      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(409);

      // Assert
      expect(response.body.error).toContain('Email already registered');
    });
  });

  describe('GET /api/users/:id', () => {
    it('should return user when found', async () => {
      // Arrange
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'SecurePass123!',
      };
      const createResponse = await request(app)
        .post('/api/users')
        .send(userData);
      const userId = createResponse.body.id;

      // Act
      const response = await request(app)
        .get(`/api/users/${userId}`)
        .expect(200);

      // Assert
      expect(response.body).toMatchObject({
        id: userId,
        name: userData.name,
        email: userData.email,
      });
    });

    it('should return 404 when user not found', async () => {
      // Act
      const response = await request(app)
        .get('/api/users/non-existent-id')
        .expect(404);

      // Assert
      expect(response.body.error).toContain('User not found');
    });
  });
});
```

## End-to-End Testing

### When to Write E2E Tests

E2E tests are expensive. Write them for:

- **Critical User Flows**: Login, checkout, data submission
- **Happy Paths**: Primary use case for each feature
- **High-Risk Features**: Payment processing, data deletion
- **Regression Prevention**: Bugs that made it to production

Don't write E2E tests for:

- **Edge Cases**: Handle in unit/integration tests
- **Every Permutation**: Too slow and brittle
- **Internal APIs**: Use integration tests instead

### Playwright Example

```typescript
// tests/e2e/user-registration.spec.ts
import { test, expect } from '@playwright/test';

test.describe('User Registration Flow', () => {
  test('should register new user successfully', async ({ page }) => {
    // Arrange
    const testUser = {
      name: 'Jane Doe',
      email: `jane.${Date.now()}@example.com`,
      password: 'SecurePass123!',
    };

    // Act
    await page.goto('/register');
    await page.fill('input[name="name"]', testUser.name);
    await page.fill('input[name="email"]', testUser.email);
    await page.fill('input[name="password"]', testUser.password);
    await page.fill('input[name="confirmPassword"]', testUser.password);
    await page.click('button[type="submit"]');

    // Assert
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('h1')).toContainText(`Welcome, ${testUser.name}`);

    // Verify user can log out and back in
    await page.click('button:has-text("Logout")');
    await expect(page).toHaveURL('/login');

    await page.fill('input[name="email"]', testUser.email);
    await page.fill('input[name="password"]', testUser.password);
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL('/dashboard');
  });

  test('should show error for duplicate email', async ({ page }) => {
    // This test would need a seeded user or create one first
    const existingEmail = 'existing@example.com';

    await page.goto('/register');
    await page.fill('input[name="name"]', 'New User');
    await page.fill('input[name="email"]', existingEmail);
    await page.fill('input[name="password"]', 'SecurePass123!');
    await page.fill('input[name="confirmPassword"]', 'SecurePass123!');
    await page.click('button[type="submit"]');

    await expect(page.locator('.error')).toContainText('Email already registered');
  });
});
```

## Mocking Strategies

### When to Mock

Mock external dependencies that are:

- **Slow**: Database, network calls, file I/O
- **Non-deterministic**: Random numbers, current time, external APIs
- **Expensive**: Third-party API calls with usage limits
- **Unavailable**: Services not running in test environment

### When NOT to Mock

Don't mock:

- **The Code Under Test**: Mock dependencies, not the subject
- **Simple Objects**: Plain data objects don't need mocking
- **Everything**: Over-mocking leads to tests that don't test reality

### Mocking Tools

#### Jest (JavaScript/TypeScript)

```typescript
// Mock entire module
jest.mock('./userRepository');

// Mock specific function
const mockSave = jest.fn();
userRepository.save = mockSave;

// Mock with implementation
mockSave.mockImplementation(async (user) => ({ ...user, id: '123' }));

// Mock resolved value
mockSave.mockResolvedValue({ id: '123', name: 'John' });

// Mock rejected value
mockSave.mockRejectedValue(new Error('Database error'));

// Verify calls
expect(mockSave).toHaveBeenCalledWith(expectedUser);
expect(mockSave).toHaveBeenCalledTimes(1);
```

#### pytest (Python)

```python
from unittest.mock import Mock, patch

# Mock object
mock_repo = Mock()
mock_repo.save.return_value = {"id": "123"}

# Mock with context manager
with patch('src.services.user_service.UserRepository') as MockRepo:
    mock_instance = MockRepo.return_value
    mock_instance.save.return_value = {"id": "123"}

    # Test code here

# Mock as decorator
@patch('src.services.user_service.UserRepository')
def test_something(mock_repo):
    mock_repo.return_value.save.return_value = {"id": "123"}
    # Test code here
```

#### testify/mock (Go)

```go
// Using testify/mock
type MockUserRepository struct {
    mock.Mock
}

func (m *MockUserRepository) Save(user *User) (*User, error) {
    args := m.Called(user)
    return args.Get(0).(*User), args.Error(1)
}

// In test
mockRepo := new(MockUserRepository)
mockRepo.On("Save", mock.AnythingOfType("*User")).Return(&User{ID: "123"}, nil)
```

## CI Integration

### Running Tests in GitHub Actions

```yaml
# .github/workflows/test.yml
name: Test

on:
  pull_request:
  push:
    branches: [main, develop]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run unit tests
        run: npm test -- --coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
          flags: unittests

  integration-tests:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Run migrations
        run: npm run db:migrate
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test

      - name: Run integration tests
        run: npm run test:integration
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright
        run: npx playwright install --with-deps

      - name: Run E2E tests
        run: npm run test:e2e

      - name: Upload test results
        if: failure()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-results
          path: playwright-report/
```

## Best Practices

### 1. Fast Tests

Unit tests should run in milliseconds:

- Mock slow dependencies (database, network, file I/O)
- Avoid unnecessary setup/teardown
- Run tests in parallel when possible
- Keep test suites under 10 seconds total

### 2. Independent Tests

Tests should not depend on each other:

- No shared state between tests
- Each test sets up its own data
- Tests can run in any order
- Use `beforeEach` to reset state

### 3. Deterministic Tests

Tests should always produce the same result:

- Mock randomness and time
- Don't depend on external state
- Avoid race conditions
- Clean up after tests

### 4. Clear Error Messages

Failed tests should immediately reveal the problem:

```typescript
// Bad: Unclear what failed
expect(result).toBe(true);

// Good: Clear what was expected
expect(user.isActive).toBe(true);

// Better: Custom message
expect(user.isActive).toBe(true, 'User should be active after email verification');

// Best: Descriptive test name + clear assertion
it('should activate user after email verification', () => {
  expect(user.isActive).toBe(true);
});
```

### 5. Test One Thing

Each test should verify one behavior:

```typescript
// Bad: Testing multiple behaviors
it('should handle user operations', () => {
  const user = service.createUser(data);
  expect(user.id).toBeDefined();

  const updated = service.updateUser(user.id, newData);
  expect(updated.name).toBe(newData.name);

  service.deleteUser(user.id);
  expect(service.getUser(user.id)).toBeNull();
});

// Good: Separate tests for each behavior
it('should create user with generated ID', () => {
  const user = service.createUser(data);
  expect(user.id).toBeDefined();
});

it('should update user name', () => {
  const updated = service.updateUser(userId, newData);
  expect(updated.name).toBe(newData.name);
});

it('should return null after deleting user', () => {
  service.deleteUser(userId);
  expect(service.getUser(userId)).toBeNull();
});
```

### 6. Avoid Test Duplication

Use test helpers and fixtures:

```typescript
// tests/helpers/userHelper.ts
export function createTestUser(overrides = {}) {
  return {
    name: 'Test User',
    email: 'test@example.com',
    password: 'SecurePass123!',
    ...overrides,
  };
}

// In tests
const user = createTestUser({ email: 'specific@example.com' });
```

### 7. Test Error Cases

Don't just test happy paths:

- Invalid input
- Boundary conditions
- Missing required fields
- Null/undefined values
- Network failures
- Database errors

## Common Anti-Patterns

### 1. Testing Implementation Details

```typescript
// Bad: Testing internal state
it('should set internal flag', () => {
  service.processUser(user);
  expect(service._processed).toBe(true); // Internal detail
});

// Good: Testing observable behavior
it('should mark user as processed', () => {
  service.processUser(user);
  const result = service.getUser(user.id);
  expect(result.status).toBe('processed');
});
```

### 2. Slow Tests

```typescript
// Bad: Unnecessary delays
it('should process async operation', async () => {
  await service.start();
  await new Promise(resolve => setTimeout(resolve, 1000)); // Arbitrary wait
  expect(service.isRunning()).toBe(true);
});

// Good: Mock or await properly
it('should process async operation', async () => {
  await service.start();
  expect(service.isRunning()).toBe(true);
});
```

### 3. Flaky Tests

```typescript
// Bad: Race condition
it('should update after interval', (done) => {
  service.startPolling();
  setTimeout(() => {
    expect(service.data).toBeDefined();
    done();
  }, 100); // Might be too short on slow CI
});

// Good: Wait for condition
it('should update after interval', async () => {
  service.startPolling();
  await waitFor(() => service.data !== null);
  expect(service.data).toBeDefined();
});
```

## Summary

Testing at Builders International means:

- **Comprehensive Coverage**: >80% required, >90% preferred
- **Test Pyramid**: Mostly unit, some integration, few E2E
- **TDD Practice**: Write tests first for better design
- **Fast Feedback**: Unit tests run in seconds
- **CI Integration**: All tests run on every PR
- **Clear Communication**: Test names and errors reveal problems immediately

Quality tests are the foundation of quality code.
