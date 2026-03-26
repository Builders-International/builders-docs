# Code Review Process

## Introduction

Code review is a collaborative learning process where team members review each other's code before it's merged into the main codebase. At Builders International, code review is not gatekeeping—it's a conversation that makes code better and helps everyone grow.

## Philosophy

### Collaborative Learning

Code review is fundamentally about learning together:

- **Knowledge Sharing**: Reviewers learn new techniques, authors get fresh perspectives
- **Collective Ownership**: The team owns the code together, not individuals
- **Mentorship**: Senior developers guide junior developers, and vice versa
- **Quality Culture**: Reviews normalize high standards and best practices

### Psychological Safety

Reviews should feel safe and supportive:

- **Assume Good Intent**: Everyone is trying their best
- **Ask Questions**: "Why did you choose X?" not "X is wrong"
- **We Language**: "We could improve..." not "You should fix..."
- **Celebrate Good Work**: Point out what's done well, not just problems
- **Learn from Mistakes**: Bugs are learning opportunities, not character flaws

### Balance Speed and Thoroughness

Be timely but thorough:

- **First Response**: Within 4 hours during work hours
- **Complete Review**: Within 24 hours
- **Hotfixes**: Can be expedited with async review
- **Blocking Issues**: Clearly marked and explained
- **Trust and Verify**: Trust the author, but verify the details

## When to Request Review

### Every PR Requires Review

No exceptions. Even for:

- Documentation updates
- Configuration changes
- Typo fixes
- Emergency hotfixes (can be reviewed async)

Why? Fresh eyes catch issues and spread knowledge.

### When to Create a PR

Create a PR when:

- Feature is complete and tested
- All tests are passing locally
- Code is self-reviewed
- Documentation is updated
- Breaking changes are documented

Don't create a PR:

- For work-in-progress (use draft PRs instead)
- Before running tests locally
- Without a clear description

## Review Requirements

### Approval Requirements

Different changes need different approval levels:

| Change Type | Required Approvals |
|-------------|-------------------|
| Application code | 1 team member |
| Infrastructure changes | 1 platform team member |
| Database migrations | 1 senior developer |
| Security-sensitive | 1 security-aware reviewer |
| Breaking changes | Discussion + 1 approval |
| Emergency hotfix | 1 approval (can be async) |

### Automated Checks

PRs must pass automated checks before review:

- All tests passing (unit, integration, E2E)
- Linting with no errors
- Code coverage threshold met (>80%)
- Security scans passing
- Build succeeds

Reviewers should not spend time on issues automation can catch.

### Review Checklist

Reviewers should verify:

- [ ] **Functionality**: Does the code do what it's supposed to?
- [ ] **Tests**: Are there comprehensive tests? Do they pass?
- [ ] **Readability**: Is the code clear and maintainable?
- [ ] **Performance**: Are there obvious performance issues?
- [ ] **Security**: Are there security vulnerabilities?
- [ ] **Documentation**: Is documentation updated?
- [ ] **Breaking Changes**: Are breaking changes documented and discussed?
- [ ] **Error Handling**: Are errors handled appropriately?
- [ ] **Edge Cases**: Are edge cases considered?

## Review Timelines

### Response Time Expectations

| Priority | First Response | Complete Review |
|----------|---------------|-----------------|
| Emergency hotfix | 1 hour | 2 hours |
| High priority | 2 hours | 8 hours |
| Normal | 4 hours | 24 hours |
| Low priority | 8 hours | 48 hours |

### Managing Your Time

If you can't review within expected time:

1. Acknowledge the request: "I'll review this by end of day"
2. If blocked, suggest another reviewer
3. If out of office, set auto-responder with alternative reviewer

### Author Responsibilities

After requesting review:

- Be responsive to questions and feedback
- Fix issues promptly
- Update the PR when changes are made
- Resolve or respond to all comments
- Don't merge until approved

## Giving Effective Feedback

### Be Specific and Actionable

```markdown
❌ Bad: "This code is confusing"
✅ Good: "This function is hard to understand. Consider extracting the validation logic into a separate function with a descriptive name."

❌ Bad: "This won't scale"
✅ Good: "This N+1 query will cause performance issues with many users. Consider using a JOIN or eager loading."

❌ Bad: "Why did you do it this way?"
✅ Good: "I'm curious about the choice to use polling here. Have you considered using webhooks instead?"
```

### Explain Why, Not Just What

Help the author understand the reasoning:

```markdown
❌ "Use const instead of let"

✅ "Use const instead of let here. Since this variable is never reassigned, const better communicates the intent and prevents accidental reassignment."

❌ "Add error handling"

✅ "Add error handling for the API call. If the service is down, the application will crash without a try/catch block. Consider returning a user-friendly error message."
```

### Distinguish Blocking vs Non-Blocking

Use clear labels for severity:

```markdown
**🚫 Blocking:** This function doesn't handle null values, which will cause a crash. Please add null checks.

**⚠️ Important:** Consider adding logging here for debugging purposes. Not blocking, but strongly recommended.

**💡 Suggestion:** You could simplify this with array destructuring. Optional improvement.

**❓ Question:** Why did we choose to store this in memory instead of the database?

**✨ Nice:** Great use of TypeScript generics here! Very elegant.
```

### Use "We" Language

Foster collaboration with inclusive language:

```markdown
❌ "You should rename this variable"
✅ "We could rename this to `activeUsers` for clarity"

❌ "Your function is too complex"
✅ "This function is doing several things. We could split it into smaller functions for better testability."

❌ "You forgot to add tests"
✅ "I don't see tests for the error case. Should we add some?"
```

### Ask Questions, Don't Demand

Questions invite discussion and learning:

```markdown
❌ "Change this to use async/await"
✅ "Would async/await make this more readable than promise chains?"

❌ "This needs to be refactored"
✅ "Have you considered extracting this into a helper function? It might be reused in other places."

❌ "Use the repository pattern"
✅ "I'm wondering if the repository pattern would help with testability here. What do you think?"
```

### Provide Examples

Show don't just tell:

```markdown
This validation could be simplified:

```typescript
// Current
if (user.email === null || user.email === undefined || user.email === '') {
  throw new Error('Email is required');
}

// Suggestion
if (!user.email?.trim()) {
  throw new Error('Email is required');
}
```
```

### Praise Good Work

Positive feedback is important:

```markdown
✨ "Excellent test coverage on this feature!"

✨ "Great choice using the builder pattern here. Makes the code very readable."

✨ "Nice catch on that edge case. I wouldn't have thought of that."

✨ "The documentation you added is really helpful. Thanks!"
```

## Receiving Feedback

### Default to Agreement

The reviewer is probably right:

- They have fresh eyes
- They might know something you don't
- They're trying to help
- Even if you disagree, consider their perspective

### Ask Questions If Unclear

Don't guess what feedback means:

```markdown
Author: "I'm not sure I understand the concern about performance here. Could you elaborate on what scenario you're thinking of?"

Author: "Can you give an example of how you'd structure this differently?"

Author: "I haven't used the repository pattern before. Do you have a resource I could read?"
```

### Push Back Respectfully

If you disagree, explain your reasoning:

```markdown
Author: "I considered async/await here, but chose promises because we need Promise.all for parallel execution. async/await would make these sequential. What do you think?"

Author: "I understand the concern about complexity, but splitting this function would require passing 5 parameters around. I think the current approach is more maintainable. Happy to discuss alternatives."
```

### Fix Issues Promptly

When you agree with feedback:

1. Acknowledge: "Good catch! I'll fix this."
2. Make the changes
3. Push updated code
4. Comment when done: "Fixed in the latest commit"
5. Resolve the comment thread

### Respond to All Comments

Even if just to acknowledge:

- "Fixed" ✅
- "Good point, updated" ✅
- "Done" ✅
- "Great suggestion, thanks!" ✅

Don't leave comments unaddressed.

## Security Review

### Security Checklist

Always review for common vulnerabilities:

#### Input Validation

```typescript
// ❌ Unsafe: No validation
app.post('/api/users', (req, res) => {
  const user = await db.users.create(req.body);
  res.json(user);
});

// ✅ Safe: Input validated
app.post('/api/users', (req, res) => {
  const schema = z.object({
    name: z.string().min(1).max(100),
    email: z.string().email(),
    age: z.number().int().min(0).max(150),
  });

  const data = schema.parse(req.body); // Throws on invalid input
  const user = await db.users.create(data);
  res.json(user);
});
```

#### SQL Injection Prevention

```typescript
// ❌ Dangerous: SQL injection vulnerability
const query = `SELECT * FROM users WHERE email = '${email}'`;
const users = await db.raw(query);

// ✅ Safe: Parameterized query
const users = await db.users.where({ email });
```

#### XSS Prevention

```typescript
// ❌ Dangerous: XSS vulnerability
app.get('/search', (req, res) => {
  res.send(`<h1>Results for: ${req.query.q}</h1>`);
});

// ✅ Safe: Escaped output
app.get('/search', (req, res) => {
  res.render('search', { query: req.query.q }); // Template engine escapes
});
```

#### Authentication & Authorization

```typescript
// ❌ Missing auth check
app.delete('/api/users/:id', async (req, res) => {
  await db.users.delete(req.params.id);
  res.json({ success: true });
});

// ✅ Auth and authz verified
app.delete('/api/users/:id', requireAuth, async (req, res) => {
  const user = await db.users.findById(req.params.id);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Users can only delete themselves, admins can delete anyone
  if (req.user.id !== user.id && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  await db.users.delete(req.params.id);
  res.json({ success: true });
});
```

#### Secrets Management

```typescript
// ❌ Hardcoded secrets
const apiKey = 'sk_live_1234567890';
const dbPassword = 'my_password_123';

// ✅ Environment variables
const apiKey = process.env.STRIPE_API_KEY;
const dbPassword = process.env.DATABASE_PASSWORD;

if (!apiKey || !dbPassword) {
  throw new Error('Required environment variables not set');
}
```

#### Secure Communication

```typescript
// ❌ No HTTPS enforcement
app.listen(3000);

// ✅ HTTPS enforced
app.use((req, res, next) => {
  if (req.header('x-forwarded-proto') !== 'https' && process.env.NODE_ENV === 'production') {
    res.redirect(`https://${req.header('host')}${req.url}`);
  } else {
    next();
  }
});

// Security headers
app.use(helmet({
  contentSecurityPolicy: true,
  xssFilter: true,
  noSniff: true,
  hsts: true,
}));
```

### When to Escalate Security Concerns

Escalate to security team if you see:

- Authentication bypass
- Authorization vulnerabilities
- SQL injection
- XSS vulnerabilities
- Hardcoded secrets
- Unsafe cryptography
- Exposed sensitive data
- Command injection

Don't approve security-sensitive PRs without expert review.

## Performance Review

### Common Performance Issues

#### N+1 Query Problem

```typescript
// ❌ N+1 queries: 1 query for users + N queries for projects
const users = await db.users.findAll();
for (const user of users) {
  user.projects = await db.projects.where({ userId: user.id });
}

// ✅ Single query with join
const users = await db.users.findAll({
  include: [{ model: db.projects }],
});
```

#### Missing Database Indexes

```typescript
// ❌ No index on frequently queried field
// Schema:
// CREATE TABLE users (
//   id UUID PRIMARY KEY,
//   email VARCHAR(255),
//   created_at TIMESTAMP
// );

// This query will be slow on large tables:
const user = await db.users.where({ email });

// ✅ Add index
// CREATE INDEX idx_users_email ON users(email);
```

#### Inefficient Algorithms

```typescript
// ❌ O(n²) complexity
function findDuplicates(arr: number[]): number[] {
  const duplicates = [];
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] === arr[j]) {
        duplicates.push(arr[i]);
      }
    }
  }
  return duplicates;
}

// ✅ O(n) complexity
function findDuplicates(arr: number[]): number[] {
  const seen = new Set<number>();
  const duplicates = new Set<number>();

  for (const num of arr) {
    if (seen.has(num)) {
      duplicates.add(num);
    } else {
      seen.add(num);
    }
  }

  return Array.from(duplicates);
}
```

#### Memory Leaks

```typescript
// ❌ Event listener never removed (memory leak)
class Component {
  constructor() {
    window.addEventListener('resize', this.handleResize);
  }

  handleResize = () => {
    // Handle resize
  }
}

// ✅ Cleanup on destroy
class Component {
  constructor() {
    window.addEventListener('resize', this.handleResize);
  }

  handleResize = () => {
    // Handle resize
  }

  destroy() {
    window.removeEventListener('resize', this.handleResize);
  }
}
```

#### Unnecessary Re-renders (React)

```typescript
// ❌ Creates new object every render
function UserList({ users }) {
  const config = { sortBy: 'name', order: 'asc' }; // New object every time
  return <SortableList items={users} config={config} />;
}

// ✅ Memoized config
function UserList({ users }) {
  const config = useMemo(
    () => ({ sortBy: 'name', order: 'asc' }),
    []
  );
  return <SortableList items={users} config={config} />;
}
```

### When Performance Matters

Not every line needs optimization. Focus on:

- **User-facing operations**: Page load, interactions
- **High-frequency code**: Executed thousands of times
- **Database queries**: Often the bottleneck
- **Large datasets**: Processing thousands of records

Profile before optimizing. Don't guess.

## Code Anti-Patterns to Watch For

### God Classes/Functions

```typescript
// ❌ God function: Does too many things
async function handleUserRequest(req, res) {
  // Validate input (30 lines)
  // Check authentication (20 lines)
  // Query database (25 lines)
  // Transform data (40 lines)
  // Send email (15 lines)
  // Update cache (10 lines)
  // Log activity (10 lines)
  // Return response (5 lines)
}

// ✅ Single Responsibility: Each function does one thing
async function handleUserRequest(req, res) {
  const validatedData = validateInput(req.body);
  const user = await authenticate(req);
  const data = await fetchUserData(user.id);
  const transformed = transformData(data);
  await sendNotificationEmail(user, transformed);
  await updateCache(user.id, transformed);
  logActivity(user, 'fetch_data');
  res.json(transformed);
}
```

### Premature Optimization

```typescript
// ❌ Premature optimization: Adds complexity for theoretical performance gain
class UserCache {
  private cache: Map<string, WeakRef<User>> = new Map();
  private finalizationRegistry = new FinalizationRegistry((key) => {
    this.cache.delete(key);
  });

  set(key: string, user: User) {
    const ref = new WeakRef(user);
    this.cache.set(key, ref);
    this.finalizationRegistry.register(user, key);
  }

  // More complex code...
}

// ✅ Simple solution: Profile first, optimize if needed
class UserCache {
  private cache: Map<string, User> = new Map();

  set(key: string, user: User) {
    this.cache.set(key, user);
  }

  // Simple and sufficient for most cases
}
```

### Over-Engineering

```typescript
// ❌ Over-engineered: Abstract factory for simple object creation
interface UserFactory {
  createUser(data: UserData): User;
}

class StandardUserFactory implements UserFactory {
  createUser(data: UserData): User {
    return new User(data);
  }
}

class PremiumUserFactory implements UserFactory {
  createUser(data: UserData): User {
    return new PremiumUser(data);
  }
}

class UserFactoryProvider {
  getFactory(type: string): UserFactory {
    switch (type) {
      case 'premium': return new PremiumUserFactory();
      default: return new StandardUserFactory();
    }
  }
}

// ✅ Simple and sufficient
function createUser(data: UserData, isPremium: boolean = false): User {
  return isPremium ? new PremiumUser(data) : new User(data);
}
```

### Copy-Paste Code

```typescript
// ❌ Duplicated logic
function validateEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function validateUserEmail(user: User): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(user.email);
}

function checkEmailFormat(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// ✅ DRY: Single source of truth
function isValidEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function validateUserEmail(user: User): boolean {
  return isValidEmail(user.email);
}
```

### Missing Error Handling

```typescript
// ❌ Ignoring errors
async function fetchUserData(userId: string) {
  const response = await fetch(`/api/users/${userId}`);
  const data = await response.json();
  return data;
}

// ✅ Proper error handling
async function fetchUserData(userId: string): Promise<User> {
  try {
    const response = await fetch(`/api/users/${userId}`);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    logger.error('Failed to fetch user data', { userId, error });
    throw new Error('Unable to fetch user data. Please try again later.');
  }
}
```

## Review Tools and Workflow

### GitHub PR Workflow

1. **Create PR**: Author creates PR with clear description
2. **Automated Checks**: CI runs tests, linting, security scans
3. **Request Review**: Author requests review from team members
4. **Review**: Reviewers provide feedback
5. **Address Feedback**: Author makes changes
6. **Re-review**: Reviewers verify changes
7. **Approve**: Reviewers approve PR
8. **Merge**: Author or reviewer merges PR
9. **Deploy**: CI/CD deploys changes

### Review Comments

Use GitHub's review features:

- **Comment**: Ask questions, make suggestions
- **Request Changes**: Block merge until issues fixed
- **Approve**: Changes look good to merge
- **Resolve Conversation**: Mark feedback as addressed

### Suggested Changes

Use GitHub's suggested changes feature:

```markdown
```suggestion
const activeUsers = users.filter(user => user.isActive);
```
```

Author can accept with one click.

## Common Review Scenarios

### Scenario: Large PR (500+ lines)

**Problem**: Too much to review effectively

**Solution**:
1. Ask author to split into smaller PRs if possible
2. Review in multiple passes (architecture → details → tests)
3. Schedule synchronous review call for complex changes
4. Request summary of changes by file/component

### Scenario: Disagreement on Approach

**Problem**: Reviewer and author can't agree

**Solution**:
1. Discuss synchronously (call or Slack)
2. Explain both perspectives
3. Involve senior developer or team lead
4. Focus on principles, not preferences
5. Document decision for future reference

### Scenario: Emergency Hotfix

**Problem**: Production is broken, need fast review

**Solution**:
1. Create PR marked as "🚨 HOTFIX"
2. Request immediate review in team channel
3. Focus review on fix, not perfection
4. Approve if fix is correct and safe
5. Create follow-up ticket for improvements
6. Review async if necessary (approve for deploy, review details after)

### Scenario: Reviewer Doesn't Understand Code

**Problem**: Code is too complex or unfamiliar

**Solution**:
1. Ask questions: "Can you explain what this does?"
2. Request documentation or comments
3. Suggest simplification if truly complex
4. Learn from the author's explanation
5. Consider pairing on similar future work

### Scenario: Nitpicky Feedback

**Problem**: Reviewer focuses on minor style issues

**Solution**:
1. If automated linting can catch it, add linting rule
2. Mark as non-blocking suggestion
3. Consider if feedback improves readability (if not, let it go)
4. Don't require changes for personal preference

## Review Metrics

Track review health:

### Speed Metrics

- **Time to first response**: Should be <4 hours
- **Time to approval**: Should be <24 hours
- **PR merge rate**: >80% of PRs merged within 48 hours

### Quality Metrics

- **Bugs caught in review**: Track to show value
- **Review comments per PR**: 3-10 is healthy
- **Approval rate**: 100% approval rate may mean rubber-stamping

### Engagement Metrics

- **Review participation**: Everyone should review regularly
- **Comment response time**: How fast authors respond
- **Re-review cycles**: 1-2 is normal, >3 may indicate issues

## Summary

Effective code review at Builders International means:

- **Collaborative Learning**: Reviews help everyone grow
- **Timely Feedback**: First response within 4 hours, complete within 24
- **Clear Communication**: Specific, actionable, kind feedback
- **Security Focus**: Always check for common vulnerabilities
- **Performance Awareness**: Catch obvious performance issues
- **Trust and Verify**: Balance speed with thoroughness
- **Psychological Safety**: Safe to make mistakes and ask questions

Great code review makes great code and great teams.
