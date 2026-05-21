# Stavové diagramy

RQU008 nepoužívá stavové diagramy. Novinky ani referenční dokumenty nemají netriviální životní cyklus – příznak `markedAsRead` je prostý dvojstavový atribut (nepřečteno → přečteno) bez zpětného přechodu, modelovaný jako vazební třída [L049](04_logicky_model.md#lm-L049).
