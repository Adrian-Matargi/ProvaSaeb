from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProdutoViewSet, MovimentacaoViewSet

router = DefaultRouter()
router.register('produtos', ProdutoViewSet)
router.register('movimentacoes', MovimentacaoViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
 