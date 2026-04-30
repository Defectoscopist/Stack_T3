import re

# Read the file
with open(r'c:\Users\kuzivanov\prj\Repos\Stack_T3\default\prisma\seed.ts', 'r') as f:
    content = f.read()

# Function to assign sex based on product name and description
def assign_sex(product_name, description):
    name_lower = product_name.lower()
    desc_lower = description.lower()
    
    # Women-specific indicators
    if any(x in name_lower for x in ['leggings', 'women', 'ladies', 'girls']):
        return 'Sex.WOMEN'
    if any(x in desc_lower for x in ['leggings', 'high-waist']):
        return 'Sex.WOMEN'
    if any(x in name_lower for x in ['bra', 'sports bra']):
        return 'Sex.WOMEN'
    
    # Kids indicators
    if any(x in name_lower for x in ['kids', 'child', 'junior']):
        return 'Sex.KIDS'
    
    # Men indicators  
    if any(x in name_lower for x in ['men', 'mens', 'boys']):
        return 'Sex.MEN'
    
    # Default to UNISEX
    return 'Sex.UNISEX'

# Find all product definitions and add sex field
# Pattern: look for `brandId: [^,]+,` on a product object and add sex after it
pattern = r"(name: '([^']+)',\s+description: '([^']+)'[^}]*?brandId: [^,]+,)"

def replace_func(match):
    full_match = match.group(1)
    prod_name = match.group(2)
    prod_desc = match.group(3)
    sex = assign_sex(prod_name, prod_desc)
    # Find the position to insert sex (after brandId line)
    return full_match + f"\n    sex: {sex},"

new_content = re.sub(pattern, replace_func, content, flags=re.DOTALL)

# Write the file back
with open(r'c:\Users\kuzivanov\prj\Repos\Stack_T3\default\prisma\seed.ts', 'w') as f:
    f.write(new_content)

print("Added sex field to products")
