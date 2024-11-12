#!/usr/bin/env python3
"""
Web scraper for faculty data from HS Düsseldorf website.
Extracts names and room numbers directly from the overview page.
"""

import requests
from bs4 import BeautifulSoup
import json
import re
from pathlib import Path

class FacultyScraper:
    def __init__(self):
        self.base_url = "https://medien.hs-duesseldorf.de"
        self.overview_url = f"{self.base_url}/personen/Seiten/uebersicht_en.aspx"
        self.output_file = Path("faculty_data.json")
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })

    @staticmethod
    def clean_text(text):
        """Clean whitespace and newlines from text"""
        if text is None:
            return ""
        return re.sub(r'\s+', ' ', text).strip()

    def extract_person_data(self, person_div):
        """Extract name and room from a person's div"""
        try:
            # Get name from the OverviewTitle link
            name_link = person_div.find('a', class_='OverviewTitle')
            if not name_link:
                return None
                
            # Get the name from the first instance
            name = name_link.get_text(strip=True)
            
            # Check if there's a title in a second OverviewTitle
            title_links = person_div.find_all('a', class_='OverviewTitle')
            if len(title_links) > 1:
                title = title_links[1].get_text(strip=True)
                if title:  # If title exists, prepend it to name
                    name = f"{title} {name}"
            
            # Find room in the toggleText div
            toggle_div = person_div.find('div', id=re.compile(r'toggleText_\d+$'))
            if not toggle_div:
                return None
                
            # Look for room pattern in the text
            room_text = toggle_div.get_text()
            room_match = re.search(r'Room\s+([0-9]{2,3}\.(?:[A-Z]\.|[0-9]\.)[0-9]{3})', room_text)
            
            if room_match:
                room = room_match.group(1)
                return {
                    "name": name,
                    "room": room
                }
                
            return None

        except Exception as e:
            print(f"Error extracting data: {str(e)}")
            return None

    def run(self):
        """Main scraping process"""
        try:
            # Get the overview page
            response = self.session.get(self.overview_url)
            response.raise_for_status()
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Find all person divs
            person_divs = soup.find_all('div', class_='FirstLastName')
            
            print(f"Found {len(person_divs)} people to process")
            
            # Store results
            results = []
            
            # Process each person
            for div in person_divs:
                person_data = self.extract_person_data(div)
                if person_data:
                    print(f"Successfully processed: {person_data['name']}")
                    results.append(person_data)
                
            # Save to JSON file
            self.output_file.write_text(
                json.dumps(results, ensure_ascii=False, indent=2),
                encoding='utf-8'
            )
            
            print(f"\nSuccessfully processed {len(results)} faculty members")
            print(f"Data saved to {self.output_file}")
            
        except Exception as e:
            print(f"An error occurred: {str(e)}")

if __name__ == "__main__":
    scraper = FacultyScraper()
    scraper.run()