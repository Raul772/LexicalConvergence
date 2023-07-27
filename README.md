# LexicalConvergence

## Context
In this problem, there are a number of Vervet Monkeys and a number of generic Predators.
Those Vervet Monkeys are able to perceive a predator in a determined range of "vision" and also, they can alert the other monkeys, in a determined "hearing" range, that a predator was seen.

When a monkey sees a predator, it will alert the other monkeys in the hearing range with a symbol. That symbol represents that especific predator for this monkey. Each monkey has a table wich associates a symbol with a predator, this is done by setting an "use" probability for each symbol for each predator on all monkeys. The symbol with the higher probability of representing an especific predator X for a especific monkey Y, will be used to alert other monkeys when that predator X is spotted by the monkey Y.

At the start, all monkeys have individual and randomic probabilities set for their probability tables. In other words, the monkeys don't "speak" the same language at first. Two different monkeys, when in a presence of a certain predator, will alert different symbols because their probabilities of using the same symbol for that predator is different.

The goal of the whole simulation is the get all the monkeys "speaking" the same language. The symbol with the higher probability for each predator needs to be the same for all monkeys, meaning that all monkeys have the same associations of a predator and a symbol.

## Implementation Basics

In order to achieve the goal, there are many different approaches. In the case of this code, it was defined that the monkeys would learn the "converging language" as described below:

When a monkey X sees a predator Y, it will search on it's table wich of the symbols available has the higher probability of use for that predator Y. So the monkey will alert the other monkeys in it's hearing range by "yelling" that symbol. The other monkeys on the hearing range of that monkey X, will search for a predator on their neighborhood and, if a predator is seen, the monkey will increment the probability of the symbol "heard" for the predator seen by it. 

Eventually all the monkeys will end up with the same language. 
Note that "ending up with the same language" do not implies that the monkeys have the same probabilities for all the symbols and predators in their tables. It only means that the monkeys have the same association of a symbol with the higher probability and a specific predator.

Also, both monkeys and predators are able to move across the environment, wich has dimensions defined as width and height. A 2D space. In the case of this code, monkeys and predators will randomically choose an x and y coordinate for it's next position, always verifying if the position chosen is already occupied by another Agent (monkey or predator), if it is, another position is generated.


