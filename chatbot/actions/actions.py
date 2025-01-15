import json
from pathlib import Path
from typing import Any, Text, Dict, List
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
from rasa_sdk.events import SlotSet
import re


def load_data():
      products_file = Path("data/products.json")
      products = json.loads(products_file.read_text())
      return products

# generates an attachment message
def generate_attachment(products, dispatcher, message):
      data = products
      if (isinstance(products, list) and len(products)>0):
            dispatcher.utter_message(text=message, attachment=products)
            return[]
      
      dispatcher.utter_message(text="We failed to find any pets")



# shows the list of all products
class ActionShowAllProducts(Action):

    def name(self) -> Text:
        return "action_show_products"

    def run(self, dispatcher: CollectingDispatcher, tracker: Tracker, domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        products = load_data()
        dispatcher.utter_message(text="Here's a list of all the pets we offer:", attachment=products)


# shows the products that match the name
class ActionSearchByName(Action):

    def name(self) -> Text:
        return "action_search_by_name"

    def run(self, dispatcher: CollectingDispatcher, tracker: Tracker, domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        name = tracker.get_slot("name")
        products = load_data()
        results = [p for p in products if p["name"].lower() == name.lower()]
        dispatcher.utter_message(text=f"Results for '{name}':", attachment=results)
        return [SlotSet("name", None)]


class ActionSearchByCategory(Action):

    def name(self) -> Text:
        return "action_search_by_category"

    def run(self, dispatcher: CollectingDispatcher, tracker: Tracker, domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        category = tracker.get_slot("category")
        products = load_data()
        results = [p for p in products if p["type"].lower() == category.lower()]
        dispatcher.utter_message(text=f"Products in the '{category}' category:", attachment=results)
        return [SlotSet("category", None)]



class ActionSearchCheaperThan(Action):
    def name(self) -> Text:
        return "action_search_cheaper_than"
    
    def run(
        self,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        # load product data from the JSON file
        try:
            pets = load_data()
        except:
            dispatcher.utter_message(text="There was an error loading the data. Please try again.")
  
        # get price from search query
        price = tracker.get_slot("price")

        if not price:
            dispatcher.utter_message(text="Please provide a price to search for.")
            return []
        
        matching_pets = [pet for pet in pets if pet["price"] <= int(price)]
        
        if matching_pets:
            dispatcher.utter_message(text=f"Here's a list of pets that cost less than or exactly {price}€:", attachment=matching_pets)
        else:
            dispatcher.utter_message(text=f"We have no pets that cost less than {price}€.")

        return [SlotSet("price", None)]
    
class ActionSearchPricierThan(Action):
    def name(self) -> Text:
        return "action_search_pricier_than"
    
    def run(
        self,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        # load product data from the JSON file
        try:
            pets = load_data()
        except:
            dispatcher.utter_message(text="There was an error loading the data. Please try again.")
  
        # get price from search query
        price = tracker.get_slot("price")

        if not price:
            dispatcher.utter_message(text="Please provide a price to search for.")
            return []
        
        matching_pets = [pet for pet in pets if pet["price"] >= int(price)]
        
        if matching_pets:
            dispatcher.utter_message(text=f"Here's a list of pets that cost more than or exactly {price}€:", attachment=matching_pets)
        else:
            dispatcher.utter_message(text=f"We have no pets that cost more than {price}€.")

        return [SlotSet("price", None)]


""" class ActionSearchWithinPriceRange(Action):
    def name(self) -> Text:
        return "action_search_within_price_range"
    
    def run(
        self,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        # load product data from the JSON file
        try:
            pets = load_data()
        except:
            dispatcher.utter_message(text="There was an error loading the data. Please try again.")

        # get price_min and price_max from search query
        price_min = tracker.get_slot("price_min")
        price_max = tracker.get_slot("price_max")

        if not price_min or not price_max:
            dispatcher.utter_message(text="Please provide a price range to search for")
            return [SlotSet("price_min", None), SlotSet("price_max", None)]
        
        if price_min > price_max:
            dispatcher.utter_message(text="The minimum price must be less than the maximum price.")
            return [SlotSet("price_min", None), SlotSet("price_max", None)]
        
        matching_pets = [pet for pet in pets if pet["price"] >= int(price_min) and pet["price"] <= int(price_max)]
        
        if matching_pets:
            dispatcher.utter_message(text=f"Here's a list of pets priced between {price_min}€ and {price_max}€:", attachment=matching_pets)
        else:
            dispatcher.utter_message(text=f"We have no pets priced between {price_min}€ and {price_max}€.")

        return [SlotSet("price_min", None), SlotSet("price_max", None)]
 """


""" class ActionSearchByAge(Action):
    def name(self) -> Text:
        return "action_search_by_age"

    def run(
        self,
        dispatcher: CollectingDispatcher,
        tracker: Tracker,
        domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:

        # load product data from the JSON file
        try:
            pets = load_data()
        except:
            dispatcher.utter_message(text="There was an error loading the data. Please try again.")
  
        # get age from search query
        age = tracker.get_slot("age")

        if not age:
            dispatcher.utter_message(text="Please provide an age to search for.")
            return [SlotSet("age", None)]
        
        valid_age_pattern = r"^^\d+(\.\d+)? (year|years|month|months)$"

        if not re.match(valid_age_pattern, age.lower()):
            dispatcher.utter_message(text="Please provide the age in a format '[number] years' or '[number] months'.")
            return [SlotSet("age", None)]

        matching_pets = [pet for pet in pets if pet["age"] == age.lower()]

        if matching_pets:
            dispatcher.utter_message(text=f"Here's a list of pets that are {age} old:", attachment=matching_pets)

        return [SlotSet("age", None)]
 """

""" class ActionSearchCheaperThan(Action):

    def name(self) -> Text:
        return "action_search_cheaper_than"

    def run(self, dispatcher: CollectingDispatcher, tracker: Tracker, domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        price = tracker.get_slot("price")
        products = load_data()
        results = [p for p in products if p["price"] <= price]
        dispatcher.utter_message(text=f"Products cheaper than {price}:", attachment=results)
        return [SlotSet("price", None)]

 
class ActionSearchPricierThan(Action):

    def name(self) -> Text:
        return "action_search_pricier_than"

    def run(self, dispatcher: CollectingDispatcher, tracker: Tracker, domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        price = tracker.get_slot("price")
        products = load_data()
        results = [p for p in products if p["price"] > price]
        dispatcher.utter_message(text=f"Products pricier than {price}:", attachment=results)
        return [SlotSet("price", None)]
 """

class ActionSearchWithinPriceRange(Action):

    def name(self) -> Text:
        return "action_search_within_price_range"

    def run(self, dispatcher: CollectingDispatcher, tracker: Tracker, domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        price_min = tracker.get_slot("price_min")
        price_max = tracker.get_slot("price_max")

        print(f"Price Min: {price_min}, Price Max: {price_max}")
        
        
        
        # Ensure the values are valid integers
        """ try:
            price_min = int(price_min)
            price_max = int(price_max)
        except ValueError:
            dispatcher.utter_message(text="Invalid price range provided. Please ensure you input numeric values.")
            return [] """

        products = load_data()
        results = [pet for pet in products if pet["price"] >= price_min and pet["price"] <= price_max]
        print(f"Results: {results}")
        
        if results:
            dispatcher.utter_message(text=f"Products between {price_min} and {price_max}:", attachment=results)
        else:
            dispatcher.utter_message(text=f"No products found between {price_min} and {price_max}.")
        
        return [SlotSet("price_min", None), SlotSet("price_max", None)]


class ActionSearchByAge(Action):

    def name(self) -> Text:
        return "action_search_by_age"

    def run(self, dispatcher: CollectingDispatcher, tracker: Tracker, domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        age = tracker.get_slot("age")
        products = load_data()
        results = [p for p in products if p["age"] == age]
        dispatcher.utter_message(text=f"Products with age '{age}':", attachment=results)
        return [SlotSet("age", None)]


class ActionSearchBySize(Action):

    def name(self) -> Text:
        return "action_search_by_size"

    def run(self, dispatcher: CollectingDispatcher, tracker: Tracker, domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        size = tracker.get_slot("size")
        products = load_data()
        results = [p for p in products if p["size"].lower() == size.lower()]
        dispatcher.utter_message(text=f"Products with size '{size}':", attachment=results)
        return [SlotSet("size", None)]