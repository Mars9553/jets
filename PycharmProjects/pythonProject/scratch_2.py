buck_0 = {}
buck_0 ['color'] = input("what is the color: ")
buck_0['specie'] = input("what is the specie: ")
buck_0['age'] = input("what is the age: ")
print(f"Buck is {buck_0['color']}  it is a {buck_0['specie']} and it is {buck_0['age']} years old" )
for k, v in buck_0.items():
    print(f"\nkey: { k}")
    print(f"value: {v}")
