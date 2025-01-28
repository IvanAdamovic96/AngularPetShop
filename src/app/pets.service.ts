import { Injectable } from "@angular/core";
import { Pets } from "../models/pets.model";
import { RasaModel } from "../models/rasa.model";
import { HttpClient } from "@angular/common/http";


@Injectable({
    providedIn: 'root'
})
export class PetsService {


    constructor() { }

    pet: { id: number; picture: string; name: string; description: string; type: string; age: number; size: string; rating: number; price: number; } | undefined;


    public pets: Pets[] = [
        {
            id: 12131314,
            picture: "https://windycityparrot.com/wp-content/uploads/1920-cockatiel-parrot-in-the-garden-blog.jpg",
            name: "Nimfa",
            description: "Nymph - Today we find it all over the interior of Australia, in forests and steppe regions, and like a tigress, it inhabits parks and suburbs of big cities. After the tigress, the Australian parrot is the most cultivated. Her natural color is dark gray, she has a hump on her head, and the feathers near the ear holes are orange.",
            type: "Bird",
            age: 8,
            size: "Medium",
            rating: 4,
            price: 50,
        },
        {
            id: 22135512,
            picture: "https://s7d2.scene7.com/is/image/PetSmart/4041018_alt1?fmt=webp&wid=1400&hei=1400",
            name: "Blue Parakeet",
            description: "Parakeets are small, social, and intelligent birds.",
            type: "Bird",
            age: 7,
            size: "Small",
            rating: 2,
            price: 20,
        },
        {
            id: 32135512,
            picture: "https://cdn4.volusion.store/dkero-prdjp/v/vspfiles/photos/PS15000-2T.jpg?v-cache=1711707169",
            name: "Camelot Macaw",
            description: "Camelot Macaws are a hybrid macaw. They have one Scarlet Macaw Parent and one Catalina (Scarlet+Blue and Gold) Macaw Parent. This baby is absolutely stunning. This color is magnificent and are extremely social. As with any macaw, the decision to add one to your family should not be taken lightly.",
            type: "Bird",
            age: 14,
            size: "Large",
            rating: 5,
            price: 1300,
        },
        {
            id: 42213551,
            picture: "https://lafeber.com/pet-birds/wp-content/uploads/2018/06/Eclectus.jpg",
            name: "Solomon Eclectus",
            description: "Solomon Island Eclectus can make phenomenal companions. They are smart and can be great talkers. They are friendly but also do well with some independence. Eclectus require a very dynamic diet.",
            type: "Bird",
            age: 13,
            size: "Medium",
            rating: 1,
            price: 4500,
        },
        {
            id: 21213555,
            picture: "https://cdn4.volusion.store/dkero-prdjp/v/vspfiles/photos/ADB2231-2T.jpg?v-cache=1711554740",
            name: "Mitchell's Cockatoo",
            description: "Major Mitchells or Leadbeaters are absolutely stunning birds. They have a pale pink and white body. Their most striking feature is their Crest. They have a straight crest with bright red and orange striping. Major Mitchells can make wonderful companions.",
            type: "Bird",
            age: 6,
            size: "Medium",
            rating: 3,
            price: 1540,
        },
        {
            id: 52213355,
            picture: "https://www.liveaquaria.com/images/categories/large/lg68052CopperbandButterfly.jpg",
            name: "Copperband fish",
            description: "The Copperband Butterflyfish, also known as the Beaked Butterflyfish, Beaked Coralfish, or Orange Stripe Butterfly, has a long, narrow nose and mouth used for hunting into crevices and holes for food. The Copperband Butterflyfish has yellow-orange vertical bands with a black edging.",
            type: "Fish",
            age: 6,
            size: "Small",
            rating: 4,
            price: 40,
        },
        {
            id: 92213555,
            picture: "https://www.liveaquaria.com/images/categories/large/lg_73746_Blue_Tang.jpg",
            name: "Blue Tang",
            description: "Blue Tangs are best cared for in aquariums at least 6 feet in length by experienced marine (saltwater) aquarists. If you're a beginner, we recommend a similar-looking fish such as the Marine (Saltwater) Yellowtail Damselfish or Freshwater Boesemani Rainbow.",
            type: "Fish",
            age: 3,
            size: "Small",
            rating: 3,
            price: 250,
        },
        {
            id: 72213555,
            picture: "https://www.liveaquaria.com/images/categories/product/lg_91953_Black_Saddleback_Clown.jpg",
            name: "Black Clownfish",
            description: "The Black Saddleback Clownfish, sometimes referred to as the Saddleback Clownfish, is mostly black with a yellow face and striking yellow outlined pectoral fins. The center stripe of this variation covers the width of the body, unlike others within this species.",
            type: "Fish",
            age: 2,
            size: "Small",
            rating: 2,
            price: 35,
        },
        {
            id: 82213555,
            picture: "https://www.liveaquaria.com/images/categories/product/lg-66118-coral-beauty-angelfish.jpg",
            name: "Coral Angelfish",
            description: "These fishes are also known as the Twospined or Dusky Angelfish,and range from the Central and South Pacific, to the Western Pacific Ocean, and throughout the Indian Ocean. The body and head are a deep royal blue, highlighted with an iridescent orange to yellow.",
            type: "Fish",
            age: 8,
            size: "Small",
            rating: 4,
            price: 85,
        },
        {
            id: 11213555,
            picture: "https://www.liveaquaria.com/images/categories/large/lg_75306_Longhorn_Cowfish.jpg",
            name: "Longhorn Cowfish",
            description: "The Longhorn Cowfish inhabit the reefs of the Indo-Pacific, usually in the less turbid waters. The body is tan to yellow and covered with white and blue dots, and is occasionally referred to as the Yellow Boxfish; however, the Longhorn is not to be confused with Ostracion cubicus, commonly called the Yellow or Polka Dot Boxfish.",
            type: "Fish",
            age: 5,
            size: "Small",
            rating: 5,
            price: 30,
        },
        {
            id: 43213551,
            picture: "https://www.petbarn.com.au/petspot/app/uploads/2014/01/61.-Beagle.jpg",
            name: "Beagle",
            description: "Young Beagles have a great deal of stamina. Daily brisk walk will help burn off their energy. With a good run across a field, your buddy will be cheery as you during happy hour at the pub.",
            type: "Dog",
            age: 3,
            size: "Medium",
            rating: 5,
            price: 150
        },
        {
            id: 78913555,
            picture: "https://www.greencrossvets.com.au/wp-content/uploads/2019/05/Kelpie-5.jpg",
            name: "Australian Kelpie",
            description: "Kelpies are great dogs for families that love to work out. They have endless stamina and will work till they drop. Take them for frequent, vigorous runs to help expend their energy.",
            type: "Dog",
            age: 6,
            size: "Medium",
            rating: 4,
            price: 450
        },
        {
            id: 55643555,
            picture: "https://dogily.vn/wp-content/uploads/2022/08/cho-doberman.jpg",
            name: "Doberman",
            description: "A Doberman Pinscher is a good dog for active households. The Doberman is a perfect balance of strength, fearlessness, loyalty, love, intelligence and kindness. Intruders?",
            type: "Dog",
            age: 12,
            size: "Large",
            rating: 4,
            price: 650
        },
        {
            id: 65713555,
            picture: "https://cdn.wamiz.fr/cdn-cgi/image/format=auto,quality=80,width=532,height=532,fit=cover/animal/breed/pictures/66fcf999966d4775468986.jpg",
            name: "Border Collie",
            description: "A Border Collie is not for the faint-hearted and is sure to keep you on your toes. Bred for sheep herding, they are a highly intelligent breed, known for their tenacity and obedience. A happy Border Collie requires regular interaction, play and training.",
            type: "Dog",
            age: 2,
            size: "Small",
            rating: 4,
            price: 300
        },
        {
            id: 56213555,
            picture: "https://cdn.playgrnd.media/v7/img/breeds/brd_1052.jpg?w=480&h=480&fm=jpg",
            name: "Chihuahua",
            description: "They might be the smallest dog breed in the world, but what Chihuahuas lack in size they make up for with a cheerful, agile and lively personality. They can also be feisty, saucy, and strong-willed.",
            type: "Dog",
            age: 3,
            size: "Small",
            rating: 1,
            price: 250
        }
    ]


    getPets() {
        return this.pets;
    }

    fetchProduct(id: number) {
        this.pet = this.getPets().find(p => p.id === id);
        if (!this.pet) {
            console.warn(`Pet with ID ${id} not found`);
        }

    }
}