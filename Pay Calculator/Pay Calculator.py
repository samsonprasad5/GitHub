def calculate_pay(hours_worked, hourly_rate, tax_rate=0.1):
    gross_pay = hours_worked * hourly_rate
    tax_deduction = gross_pay * tax_rate
    net_pay = gross_pay - tax_deduction
    
    return gross_pay, net_pay

# Example usage
hours = float(input("Enter hours worked: "))
rate = float(input("Enter hourly rate: "))
tax = float(input("Enter tax rate (as decimal, e.g., 0.1 for 10%): "))

gross, net = calculate_pay(hours, rate, tax)
print(f"Gross Pay: ${gross:.2f}")
print(f"Net Pay after Tax: ${net:.2f}")