import re

# 1. Remove ShieldCheck from SuperAdminSidebar
with open('frontend/src/pages/Profile/SuperAdmin/SuperAdminSidebar.jsx', 'r') as f:
    content_sa = f.read()

content_sa = content_sa.replace('<ShieldCheck className="h-5 w-5 text-blue-600 hidden" />', '')

# 2. Remove SquareChevronRight from SuperAdminContextHeader header
old_sa_header_svg = '<SquareChevronRight className="h-5 w-5 text-blue-600 md:hidden" />'
content_sa = content_sa.replace(old_sa_header_svg, '')

with open('frontend/src/pages/Profile/SuperAdmin/SuperAdminSidebar.jsx', 'w') as f:
    f.write(content_sa)

# 3. Remove SquareChevronRight from DashboardLayout header
with open('frontend/src/pages/Profile/Shared/DashboardLayout.jsx', 'r') as f:
    content_dl = f.read()

# I also need to make sure I don't remove it from the sidebar!
# In DashboardLayout.jsx, the header is inside SuperAdminContextHeader equivalent? No, it's just inline in the old code?
# Wait! In DashboardLayout, there is NO SuperAdminContextHeader! It's all in one file!
pass
