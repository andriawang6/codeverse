import enum
import random

class LeetCodeQuestions(enum.Enum):
    TWO_SUM = "Two Sum"
    REVERSE_LINKED_LIST = "Reverse Linked List"
    MERGE_SORTED_ARRAYS = "Merge Sorted Arrays"
    LONGEST_SUBSTRING = "Longest Substring Without Repeating Characters"
    PALINDROME_CHECK = "Palindrome Check"
    MAX_PROFIT_FROM_STOCK_PRICES = "Max Profit from Stock Prices"

def choose_random_question():
    return random.choice(list(LeetCodeQuestions)).value
