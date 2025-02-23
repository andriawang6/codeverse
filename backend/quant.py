import enum
import random

class QuantQuestions(enum.Enum):
    BIRTHDAY_PROBLEM = (
        "How many people need to be in a room for there to be at least a 50% chance "
        "that two people share the same birthday?"
    )
    EGG_DROP_PROBLEM = (
        "Given two eggs and a 100-floor building, what is the optimal strategy to "
        "determine the highest floor from which an egg can be dropped without breaking it?"
    )
    FERMI_ESTIMATION = "Estimate the number of piano tuners in a city like Chicago."
    BAYES_THEOREM = (
        "Explain Bayes' Theorem and provide an example of its application in risk assessment."
    )
    CENTRAL_LIMIT_THEOREM = (
        "What is the Central Limit Theorem and why is it important in finance?"
    )
    EXPECTED_VALUE_VARIANCE = (
        "How do you compute the expected value and variance of a discrete random variable? "
        "Explain their significance in a financial context."
    )
    ARBITRAGE = "What is arbitrage and why is it important in financial markets?"

def choose_random_quant_question():
    return random.choice(list(QuantQuestions)).value

# Print a random quant question
print(choose_random_quant_question())
