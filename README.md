# Random Draw Generator

A web-based random draw generator for the 2-way CF. The draw is generated in accordance with USPA and FAI competition requirements.

## Dive Pool and Draw Requirements

Per the applicable competition manduals, each round consists of five points sampled (without replacement) from two sets of the dive pool. In other words, each round starts with a pool of 12 formations (i.e., A,B,C,D,E,F,A,B,C,D,E,F), all with an equal probability of being drawn. As each of the five points is drawn, it is removed from the pool and cannot be drawn again for that round (i.e., sampling without replacement).

## Implementation

The sampling is performed using the Fisher-Yates shuffle, which is an algorithm that produces a uniformly random permutation of the 12-element pool. This method guarantees that all 12! permutations (approx. half a billion possibilities) are equally likely. The first five elements of this permutation are the resulting draw.

Questions, comments, concerns? Ask Alex Sarmiento (Elsinore CRW).

## Validation

Monte Carlo sampling is used to validate the random sampling approach by computing the distribution of Tops (A,B,C) and Bottoms (D,E,F) from 10,000 draws.

Monte Carlo samping is also used to derive the empirical probability of having consecutive repeated formations in a draw (e.g., ABBDF or CDEFC). The empirical probability matches the theoretical probability, which is very tediously derived [here](https://github.com/asarmy/random-draw/blob/main/prob_repeats.md).

## Usage

The web application can be accessed through GitHub pages at: [https://asarmy.github.io/random-draw/](https://asarmy.github.io/random-draw/). Random draws can be generated and saved to PDF. There is also a link to the Monte Carlo validation exercise.
