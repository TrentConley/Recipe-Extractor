from selenium import webdriver
from selenium.webdriver import ActionChains
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.options import Options
import time

def take_screenshot(url, save_path):
    # Configure WebDriver to run headlessly
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--window-size=1920x1080")
    
    # Initialize WebDriver (assuming Chrome)
    driver = webdriver.Chrome(options=chrome_options)
    
    try:
        # Navigate to the URL
        driver.get(url)
        
        # Define the action of pressing the escape key twice
        actions = ActionChains(driver)
        actions.send_keys(Keys.ESCAPE).send_keys(Keys.ESCAPE)
        time.sleep(1)
        # Perform the action
        actions.perform()
        
        # Wait for the page to settle (if necessary)
        time.sleep(2)  # waiting for 5 seconds could be replaced with more robust wait conditions
        
        # Take screenshot
        driver.save_screenshot(save_path)
        
    except Exception as e:
        print(f"An error occurred: {e}")
    
    finally:
        # Close the browser
        driver.quit()

# Usage
url = 'https://joyboseroy.medium.com/an-overview-of-web-page-content-extraction-5e0e2c62855d'
save_path = 'screenshot.png'
take_screenshot(url, save_path)
