from rest_framework import mixins, viewsets

class AllMethodsViewSet(mixins.CreateModelMixin,
                        mixins.ListModelMixin,
                        mixins.RetrieveModelMixin,
                        mixins.UpdateModelMixin,
                        mixins.DestroyModelMixin,
                        viewsets.GenericViewSet):
    """
    A viewset that provides 'list', 'retrieve', 'create', 'update', and 'destroy' actions.

    To use it, override the class and set the 'queryset' and 
    'serlializer_class' attributes.
    """
    pass
    

class CreateUpdateDestroyViewSet(mixins.CreateModelMixin,
                                 mixins.UpdateModelMixin,
                                 mixins.DestroyModelMixin,
                                 viewsets.GenericViewSet):
    """
    A viewset that provides 'create', 'update', and 'destroy' actions.

    To use it, override the class and set the 'queryset' and 
    'serlializer_class' attributes.
    """
    pass

class CreateDestroyViewSet(mixins.CreateModelMixin,
                           mixins.DestroyModelMixin,
                           viewsets.GenericViewSet):
    """
    A viewset that provides 'create' and 'delete' actions.

    To use it override the class and set the 'queryset' and
    'serializer_class' attributes
    """