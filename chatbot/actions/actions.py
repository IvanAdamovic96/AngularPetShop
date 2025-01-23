import json
from pathlib import Path
from typing import Any, Text, Dict, List
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
from rasa_sdk.events import SlotSet
import re
import logging
logger = logging.getLogger(__name__)


def load_data():
      products_file = Path("data/products.json")
      products = json.loads(products_file.read_text())
      return products


def generate_attachment(products, dispatcher, message):
      data = products
      if (isinstance(products, list) and len(products)>0):
            dispatcher.utter_message(text=message, attachment=products)
            return[]
      
      dispatcher.utter_message(text="We failed to find any pets")



class ActionShowAllProducts(Action):

    def name(self) -> Text:
        return "action_show_products"

    def run(self, 
            dispatcher: CollectingDispatcher, 
            tracker: Tracker, 
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        products = load_data()
        dispatcher.utter_message(text="Here's a list of all the pets we offer:", attachment=products)


class ActionSearchByName(Action):

    def name(self) -> Text:
        return "action_search_by_name"

    def run(self, 
            dispatcher: CollectingDispatcher, 
            tracker: Tracker, 
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        name = tracker.get_slot("name")
        products = load_data()
        results = [p for p in products if p["name"].lower() == name.lower()]
        dispatcher.utter_message(text=f"Results for '{name}':", attachment=results)
        return [SlotSet("name", None)]


class ActionSearchByCategory(Action):

    def name(self) -> Text:
        return "action_search_by_category"

    def run(self, 
            dispatcher: CollectingDispatcher, 
            tracker: Tracker, 
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
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

        try:
            products = load_data()
        except:
            dispatcher.utter_message(text="There was an error loading the data. Please try again.")
  

        price = tracker.get_slot("price")

        if not price:
            dispatcher.utter_message(text="Please provide a price to search for.")
            return []
        
        matching_pets = [pet for pet in products if pet["price"] <= int(price)]
        
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

        try:
            products = load_data()
        except:
            dispatcher.utter_message(text="There was an error loading the data. Please try again.")
  
        price = tracker.get_slot("price")

        if not price:
            dispatcher.utter_message(text="Please provide a price.")
            return []
        
        matching_pets = [pet for pet in products if pet["price"] >= int(price)]
        
        if matching_pets:
            dispatcher.utter_message(text=f"Here's a list of pets that cost more than or exactly {price}€:", attachment=matching_pets)
        else:
            dispatcher.utter_message(text=f"We dont have pets that cost more than {price}€.")

        return [SlotSet("price", None)]



class ActionSearchWithinPriceRange(Action):

    def name(self) -> Text:
        return "action_search_within_price_range"

    def run(self, 
            dispatcher: CollectingDispatcher, 
            tracker: Tracker, 
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        price_min = tracker.get_slot("price_min")
        price_max = tracker.get_slot("price_max")

        products = load_data()
        results = [pet for pet in products if pet["price"] >= int(price_min) and pet["price"] <= int(price_max)]

        if results:
            dispatcher.utter_message(text=f"Products between {price_min} and {price_max}:", attachment=results)
        else:
            dispatcher.utter_message(text=f"No products found between {price_min} and {price_max}.")

        return [SlotSet("price_min", None), SlotSet("price_max", None)]


class ActionSearchByAge(Action):

    def name(self) -> Text:
        return "action_search_by_age"

    def run(self, 
            dispatcher: CollectingDispatcher, 
            tracker: Tracker, 
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        age = int(tracker.get_slot("age"))

        products = load_data()

        results = [p for p in products if p["age"] == age]
        dispatcher.utter_message(text=f"Products with age of '{age}' months:", attachment=results)

        return [SlotSet("age", None)]


class ActionSearchBySize(Action):

    def name(self) -> Text:
        return "action_search_by_size"

    def run(self, 
            dispatcher: CollectingDispatcher, 
            tracker: Tracker, 
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        size = tracker.get_slot("size")

        products = load_data()

        results = [p for p in products if p["size"].lower() == size.lower()]
        dispatcher.utter_message(text=f"Products with size '{size}':", attachment=results)

        return [SlotSet("size", None)]
    

class ActionAddToCart(Action):
    def name(self) -> Text:
        return "action_add_to_cart"
    
    def run(self, 
            dispatcher: CollectingDispatcher, 
            tracker: Tracker, 
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        try:
            products = load_data()
        except:
            dispatcher.utter_message(text="There was an error loading the data. Please try again.")

        name = tracker.get_slot("name")

        if not name:
            dispatcher.utter_message(text="Please provide a name.")
            return []
        
        results = [p for p in products if name.lower() in p["name"].lower()]

        if results:
            dispatcher.utter_message(
                text=f"Added {name} to the cart.",
                json_message={
                    "actionType": "add_to_cart",
                    "products": results},
                )
        else:
            dispatcher.utter_message(text="We dont have a pet with that name.")

        # Clear the slot after processing
        return [SlotSet("name", None)]