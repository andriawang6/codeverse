import enum
import random

class LeetCodeQuestions(enum.Enum):
    TWO_SUM = "Two Sum"
    REVERSE_LINKED_LIST = "Reverse Linked List"
    MERGE_SORTED_ARRAYS = "Merge Sorted Arrays"
    LONGEST_SUBSTRING = "Longest Substring Without Repeating Characters"

def choose_random_question():
    return random.choice(list(LeetCodeQuestions)).value
