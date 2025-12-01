# Probability of Consecutive Repeats in a Draw

## Problem Statement

Given a five-element draw from the pool of 12 (two copies each of A, B, C, D, E, F), what is the probability that at least one pair of consecutive positions contains the same formation, where "consecutive" includes a wrap-around to the top of the page?

Let $R$ denote the event where at least one pair of adjacent positions in a five-element draw contains identical formations (i.e., at least one "consecutive repeat"). We compute the probability $P(R)$.

## Approach

The derivation proceeds in four steps:

1. **Define the sample space.** We count all possible ordered 5-point draws from the 12-item pool. This gives us the denominator for all probability calculations.

2. **Consider multiplicity structure of the draw.** We evaluate the number of times (multiplicity) that a formation repeats by identifying the cases (structures) that are available. There are three possible cases:
   - All formations are unique (no repeats; e.g., ABCED).
   - One formation is repeated (e.g., AABFD, ABFAD, ACBDA).
   - Two formations are repeated (e.g., AABBC, DEFED).

   We compute probabilities for different repeat structures separately. The probability of occurrence of the different structure is denoted as $P_1$, $P_2$, and $P_3$.

   Draw order, or adjacency, is handled in the next step.

3. **Consider draw sequence.** We compute the probability that the repeated formations are adjacent in the draw sequence, conditioned on each multiplicity structure (or case). These conditional probabilities are denoted $P(R \mid \text{Case } i)$, where $R$ indicates the requirement (or condition) of having at least one adjacent repeat.

4. **Combine to obtain the total probability.** We weight each case's adjacency probability by how often that case occurs, then sum to get the overall probability:

$$P_{total}(R) = P_1 \cdot P(R|\text{Case 1}) + P_2 \cdot P(R|\text{Case 2}) + P_3 \cdot P(R|\text{Case 3})$$

## Combinatorics Review

A short recap of some key principles is provided below.

### Counting

**Combinations** count unordered selections. The number of ways to choose $k$ items from $n$ distinct items, where order _does not_ matter, is:

$$\binom{n}{k} = \frac{n!}{k!(n-k)!}$$

Dividing by $k!$ removes the effect of element order.

**Example:** The pool has 12 items but only 6 unique formation types (A–F): $\binom{6}{5} = 6$

**Permutations** count ordered arrangements. If we choose $k$ items from $n$ distinct items (using sampling without replacement) _and_ care about their order, we multiply by $k!$:

$$nPk = \binom{n}{k} \times k! = \frac{n!}{(n-k)!}$$

where the sampling without replacement requirement is captured with $n-k$.

**Example:** The number of unique permutations when sampling 5 items from a pool of 12 (without replacement), where order matters, is $12P5 = 95{,}040$.

**Multiset permutations** count permutations with identical items (in any slot; adjacency is not considered). If we have $n$ slots and $m_i$ are the number of times unique elements occur, then:

$$\frac{n!}{m_1!\,m_2!\cdots m_r!}$$

where we have the constraint that $m_1 + m_2 + \cdots + m_r = n$.

**Example:** In a 5-point draw with two formations that are repeated (e.g., AABBC, DEFFD), the number of distinct arrangements is $\frac{5!}{2! \cdot 2! \cdot 1!} = 30$.

### Set Operations

**Sets** are collections of distinct (unique) elements, denoted with braces (e.g., $\{X, Y, Z\}$). The number of elements in a set is called its **cardinality** and is written as $|S|$.

The **union** $S_1 \cup S_2$ contains all elements in _either_ set. The **intersection** $S_1 \cap S_2$ contains only elements in _both_ sets. The sum, $|S_1| + |S_2|$, contains elements both sets and will count them twice if they appear in both sets.

The **inclusion-exclusion principle** is a convenient way to calculate the union from teh intersection, and vice-versa:

$$|S_1 \cup S_2| = |S_1| + |S_2| - |S_1 \cap S_2|$$

## Sample Space

Because the draw corresponds to the first five elements of a uniformly random permutation of the 12 formations, and the ordering of the five elements matters, the sample space consists of all ordered samples of size five drawn without replacement from the 12-item pool. In standard statistical notation, the permutation count is:

$$12P5 = 95{,}040$$

which represents all possible ordered samples of size five (obtained through sampling without replacement).

## Partitioning by Multiplicity Structure

Each formation appears at most twice, so the available cases are:

1. All five formations distinct
2. One pair and three singles
3. Two pairs and one single

We willl count how many of the $95{,}040$ sequences match each of the available cases. We will evaluate adjacency (repeats) later.

### Case 1: All Five Formations Distinct

First, we count the number of ways to choose $k$ items from $n$ distinct items as:

$$\binom{n}{k} = \frac{n!}{k!(n-k)!}$$

- We draw five formations from 6 distinct formations: $\binom{6}{5} = 6$.

- Now we place the drawn formations in the point slots. For example, if we draw an $A$, it can be any of the five points, so we have: $5! = 120$.

- The starting pool has two copies of each formation, so we must account for which copy was drawn. If Point 1 is $A$, it can be $A_1$ or $A_2$ (2 choices). There are 2 choices for all 5 slots: $2^5 = 32$.

The total count for Case 1 is thus:

$$6 \times 120 \times 32 = 23{,}040 $$

And the probability for Case 1 is thus:

$$P_1 = \frac{23{,}040}{95{,}040} = \frac{8}{33}$$

As discussed later, Case 1 has no adjacent formations, so it drops out of the final calcuation.

### Case 2: Exactly One Formation Repeats

- We use the formula for combinations to count the number of ways to choose 1 formation (the one that repeats) from the 6 available formations: $\binom{6}{1} = 6$. (We expect it to be 6 because there are 6 unique formations.)

- Next, we count the number of ways to choose the other 3 formations from the 5 remaining formations (it is 5, not 6, because we have decided 1 formation repeats): $\binom{5}{3} = 10$.

- Now we place the drawn formations in the point slots. We have one formation that appears twice and three distinct singles, so we use the formula for multiset permutations: $\frac{5!}{2!} = 60$.

- The starting pool has two copies of each formation, so we must account for which copy was drawn. For the repeated formation, we count the ways it can be permuted across 2 slots as $2! = 2$. For the 3 single formations, we select which of the 2 copies is drawn as $2^3 = 8$.

The total count for Case 2 is thus:

$$6 \times 10 \times 60 \times 2 \times 8 = 57{,}600$$

And the probability for Case 2 is thus:

$$P_2 = \frac{57{,}600}{95{,}040} = \frac{20}{33}$$

### Case 3: Two Formations Repeat

- Again, we use the formula for combinations to count the number of ways to choose 2 formations (the ones that repeat) from the 6 available formations: $\binom{6}{2} = 15$.

- Next, we count the number of ways to choose the other formation (there is only 1) from the 4 remaining formations: $\binom{4}{1} = 4$.

- Now we place the drawn formations in the point slots. We have two formations that appear, so we use the formula for multiset permutations: $\frac{5!}{2!\cdot2!\cdot1!} = 30$.

- As before, the starting pool has two copies of each formation, so we must account for which copy was drawn. For the single formation, we select which of the 2 copies is drawn: $2^1 = 2$. For each of the 2 repeated formations, we count the ways the two copies can be permuted across their 2 slots: $2! \cdot 2! = 4$.

The total count for Case 3 is thus:

$$15 \times 4 \times 30 \times 2 \times 4 = 14{,}400$$

And the probability for Case 3 is thus:

$$P_3 = \frac{14{,}400}{95{,}040} = \frac{5}{33}$$

### Verification

The individual case counts sum to the starting sample space, as expected:

$$23{,}040 + 57{,}600 + 14{,}400 = 95{,}040$$

And the case probabilities sum to one, as expected:

$$ \frac{8}{33} + \frac{20}{33} + \frac{5}{33}= 1$$

## Probability of Adjacent Repeats

### Case 1: All Five Formations Distinct

If all five formations are distinct, then no two adjacent points (including the wrap-around pair) can be equal. Thus, we cannot have adjacent repeats:

$$P(R|\text{Case 1}) = 0$$

### Case 2: Exactly One Formation Repeats

The Stars and Bars Theorem is used first to count the ways repeated formations can be distributed across the draw. It is a combinatorial method that provides the number of ways that a repeated (or identical) object can be distributed into available slots or bins. Some repeated formations will be adjacent or sequential (e.g., AABFD) and some will not (e.g., AFBAD). We will handle adjacency in the next step.

The standard formulation for distributing $n$ identical objects into $k$ bins is:

$$\binom{n+k-1}{k-1} = \frac{(n+k-1)!}{(k-1)!n!}$$

There are three possible formations that can be repeated: Points 1, 3, or 5. Point 2 can repeat Point 1 or 3; and Point 4 can repeat Point 3 or 5. However, Point 5 can also repeat Point 1. This yields a total of three "bins" ($k$) that can hold the repeats. Given a draw with Points 1, 3, and 5 set, we have two "objects" ($n$) (Points 2 and 4) that are to be distributed, leading to six unique ways the bins can be filled:

$$\binom{2+3-1}{3-1} = 6$$

(Note that this counts the _placements_, which is different the earlier $\binom{6}{1} = 6$, which counted which formation repeats.)

This is a small number, so we can manually check it by listing the possibilities for where a repeated formation can fall:

1. Point 2, repeating Point 1 or 3; an adjacent repeat
2. Point 4, repeating Point 3 or 5; an adjacent repeat
3. Point 5, repeating Point 1; an adjacent repeat
4. Point 2, repeating Point 4 (or the inverse, Point 4 repeating Point 2); non-adjacent
5. Point 2, repeating Point 5 (or the inverse); non-adjacent
6. Point 4, repeating Point 1 (or the inverse); non-adjacent

So, we can see that three of the six possibilities result in non-adjacent repeats. We can confirm this with ordinary combination counting, where we count the number of non-adjacent solutions, using $k$ bins (3) and $n$ objects (2 open slots, Points 2 and 4):

$$\binom{k}{n} = \frac{k!}{n!(k-n)!} \longrightarrow \binom{3}{2} = 3$$

Therefore, our final probability for Case 2 is:

$$P(R|\text{Case 2}) = \frac{3}{6} = \frac{1}{2}$$

### Case 3: Two Formations Repeat

We use multiset permutation counting and inclusion-exclusion to determine the probability that at least one pair of repeated formations is adjacent. The multiset is $\{X, X, Y, Y, Z\}$, where $X$ and $Y$ are the repeated formations and $Z$ is the singleton. Some permutations will have adjacent repeats (e.g., XXZYZ) and some will not (e.g., XYZXY).

We want to count permutations with at least one adjacent pair. We don't require that both repeated pairs are adjacent. In other words, we still want to count AABCB.

As discussed above, the number of permutations is $\frac{5!}{2!\cdot2!\cdot1!} = 30$.

We use inclusion-exclusion to count arrangements with at least one adjacent pair. Let $S_X$ be the set of arrangements where the $X$ pair is adjacent, and $S_Y$ be the set where the $Y$ pair is adjacent. We ultimately want to find $|S_X \cup S_Y|$, which is the _union_. In other words, we want to count the number of times adjacency occurs in either set. We'll get there by counting the number of times adjacency occurs in _both_ sets (the intersection), because that is a little easier, and then the difference will be the union.

**Count the permutations with XX adjacent:**
We assume that we have one adjacent pair, $XX$, in the draw. That means there are 3 other slots available, and we require one repeat ($Y$) in that subset, so we use the formula for multiset permutations:

$$\frac{3!}{2! \cdot 1!} = 3$$

The $XX$ block can begin at any of 5 positions (including wrap-around: Points 1-2, 2-3, 3-4, 4-5, or 5-1), so the final count is:

$$|S_X| = 3 \times 5 = 15$$

**Count the permutations with YY adjacent:**
By symmetry, $|S_Y| = 15$.

Note that $15+15=30$, so we recover our expected 30 permutations.

**Count the number of times adjacency occurs in both sets:**
Here we are interested in the _intersection_ $|S_X \cap S_Y|$, which is where both sets have adjacent repeats. As discussed above, the $XX$ block, for example, can begin in any of the 5 slots:

- $XX$???
- ?$XX$??
- ??$XX$?
- ???$XX$
- $X$???$X$

By inspection, the $YY$ block only has 2 valid starting positions once the $XX$ block is locked-in (the point slot immediately after the repeated $X$ or the one after that). Thus:

$$|S_X \cap S_Y| = 5 \times 2 = 10$$

**Applying the inclusion-exclusion principle:**

We count the number of times adjacency occurs in _either_ set as:

$$|S_X \cup S_Y| = |S_X| + |S_Y| - |S_X \cap S_Y| = 15 + 15 - 10 = 20$$

And our final probability for Case 3 is:

$$P(R|\text{Case 3}) = \frac{20}{30} = \frac{2}{3}$$

## Result

## Total Probability

The probability that a five-element draw (taken from two copies of a six-formation dive pool) contains at least one repeated consecutive formation, counting the cyclic adjacency between Points 5 and 1, is computed as:

$$P_{total}(R) = P_1 \cdot P(R|\text{Case 1}) + P_2 \cdot P(R|\text{Case 2}) + P_3 \cdot P(R|\text{Case 3})$$

Substituting the values:

$$P(R) = 0 \cdot \frac{8}{33} + \frac{1}{2} \cdot \frac{20}{33} + \frac{2}{3} \cdot \frac{5}{33}$$

This is $\approx 0.4040$. Thus, approximately **40.4%** of all draws will contain at least one consecutive repeat.

## Empirical Validation

The Monte Carlo validation with 10,000 samples provides the empirical probability. Multiple runs of the simulation lead to approximately 40% chance of repeats, which is in excellent agreement with the theoretical prediction derived above.
