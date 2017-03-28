from selenium import webdriver
from selenium.webdriver.common.keys import Keys


driver = webdriver.Firefox()
driver.get("http://localhost:3000/")
username = driver.find_element_by_id('username')
