from rest_framework.permissions import BasePermission

class IsAlmoxarifeOuAdmin(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and 
            (request.user.is_staff or request.user.groups.filter(name='Almoxarife').exists())
        )
